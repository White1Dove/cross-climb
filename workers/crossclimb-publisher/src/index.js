const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "authorization,content-type,x-publish-secret"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

function getBearerToken(request) {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || request.headers.get("x-publish-secret") || "";
}

function timingSafeEqual(left, right) {
  if (!left || !right || left.length !== right.length) {
    return false;
  }

  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
}

function getLog(body) {
  return body?.log && typeof body.log === "object" ? body.log : body;
}

function compactLogForDispatch(log) {
  const gameId = log.game_id || "";

  return {
    schema_version: log.schema_version || "",
    source: log.source || "",
    extension_version: log.extension_version || "",
    game_platform: log.game_platform || "",
    game_id: log.game_id || "",
    game_name: log.game_name || "",
    page_url: log.page_url || "",
    puzzle_date: log.puzzle_date || "",
    puzzle_date_source: log.puzzle_date_source || "",
    puzzle_number: log.puzzle_number || log.normalized_puzzle?.issue_number || "",
    puzzle_label: log.puzzle_label || log.normalized_puzzle?.label || "",
    captured_at: log.captured_at || "",
    captured_pt_datetime: log.captured_pt_datetime || "",
    timezone_used: log.timezone_used || "",
    is_today_pt: Boolean(log.is_today_pt),
    answer_fingerprint: log.answer_fingerprint || "",
    puzzle_fingerprint: log.puzzle_fingerprint || "",
    raw_puzzle: {
      answer: log.raw_puzzle?.answer || "",
      clues: Array.isArray(log.raw_puzzle?.clues) ? log.raw_puzzle.clues : [],
      final_clue: log.raw_puzzle?.final_clue || log.normalized_puzzle?.final_clue || "",
      solved_text: log.raw_puzzle?.solved_text || ""
    },
    normalized_puzzle: {
      issue_number: log.normalized_puzzle?.issue_number || log.puzzle_number || "",
      label: log.normalized_puzzle?.label || log.puzzle_label || "",
      category: gameId === "pinpoint" ? log.normalized_puzzle?.category || log.solution?.final_answer || "" : "",
      clue_count: gameId === "pinpoint" ? log.normalized_puzzle?.clue_count || 0 : 0,
      final_clue: log.normalized_puzzle?.final_clue || log.raw_puzzle?.final_clue || "",
      word_count: log.normalized_puzzle?.word_count || 0,
      middle_word_count: log.normalized_puzzle?.middle_word_count || 0,
      word_length: log.normalized_puzzle?.word_length || 0,
      rows: Array.isArray(log.normalized_puzzle?.rows) ? log.normalized_puzzle.rows : [],
      clues: Array.isArray(log.normalized_puzzle?.clues) ? log.normalized_puzzle.clues : [],
      known_letters: Array.isArray(log.normalized_puzzle?.known_letters) ? log.normalized_puzzle.known_letters : []
    },
    solution: {
      status: log.solution?.status || "",
      top_word: log.solution?.top_word || "",
      bottom_word: log.solution?.bottom_word || "",
      ladder: Array.isArray(log.solution?.ladder) ? log.solution.ladder : [],
      full_ladder: Array.isArray(log.solution?.full_ladder) ? log.solution.full_ladder : [],
      middle_ladder: Array.isArray(log.solution?.middle_ladder) ? log.solution.middle_ladder : [],
      final_answer: log.solution?.final_answer || ""
    },
    hints: log.hints || {},
    validation: log.validation || {},
    status: log.status || "",
    notes: log.notes || ""
  };
}

function validateLog(log) {
  if (!log || typeof log !== "object") {
    return "Request body must be a log object or { log }.";
  }

  if (!["crossclimb", "pinpoint"].includes(log.game_id)) {
    return "Only crossclimb and pinpoint logs can be published by this endpoint.";
  }

  if (log.status === "conflict") {
    return "Conflict logs are not publishable.";
  }

  if (log.validation?.is_valid === false) {
    return "Invalid logs are not publishable.";
  }

  const puzzleNumber = log.puzzle_number || log.normalized_puzzle?.issue_number;
  if (!puzzleNumber) {
    return "Log is missing puzzle_number.";
  }

  if (log.game_id === "pinpoint") {
    const clues = Array.isArray(log.normalized_puzzle?.clues) ? log.normalized_puzzle.clues : [];
    const finalAnswer = log.solution?.final_answer || log.normalized_puzzle?.category;
    if (!finalAnswer) {
      return "Pinpoint log is missing final_answer.";
    }
    if (clues.length === 0) {
      return "Pinpoint log is missing normalized clues.";
    }
    return "";
  }

  const rows = Array.isArray(log.normalized_puzzle?.rows) ? log.normalized_puzzle.rows : [];
  const clues = Array.isArray(log.normalized_puzzle?.clues) ? log.normalized_puzzle.clues : [];
  if (rows.length === 0 && clues.length === 0) {
    return "Log is missing normalized puzzle rows or clues.";
  }

  return "";
}

async function dispatchGitHubWorkflow(env, log) {
  const owner = env.GITHUB_OWNER || "White1Dove";
  const repo = env.GITHUB_REPO || "cross-climb";
  const eventType = env.GITHUB_EVENT_TYPE || "crossclimb_log";
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
    method: "POST",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "content-type": "application/json",
      "user-agent": "crossclimb-log-publisher",
      "x-github-api-version": "2022-11-28"
    },
    body: JSON.stringify({
      event_type: eventType,
      client_payload: {
        log,
        received_at: new Date().toISOString(),
        source: "cloudflare_worker"
      }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub dispatch failed with ${response.status}: ${text.slice(0, 500)}`);
  }
}

const worker = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: JSON_HEADERS
      });
    }

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return jsonResponse({ ok: true, service: "crossclimb-log-publisher" });
    }

    if (request.method !== "POST" || url.pathname !== "/publish") {
      return jsonResponse({ ok: false, error: "Not found." }, 404);
    }

    if (!env.PUBLISH_SECRET || !env.GITHUB_TOKEN) {
      return jsonResponse({ ok: false, error: "Worker secrets are not configured." }, 500);
    }

    const providedSecret = getBearerToken(request);
    if (!timingSafeEqual(providedSecret, env.PUBLISH_SECRET)) {
      return jsonResponse({ ok: false, error: "Unauthorized." }, 401);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ ok: false, error: "Request body must be valid JSON." }, 400);
    }

    const log = compactLogForDispatch(getLog(body));
    const validationError = validateLog(log);
    if (validationError) {
      return jsonResponse({ ok: false, error: validationError }, 400);
    }

    try {
      await dispatchGitHubWorkflow(env, log);
      return jsonResponse({
        ok: true,
        dispatched: true,
        game_id: log.game_id,
        puzzle_number: log.puzzle_number || log.normalized_puzzle?.issue_number,
        puzzle_date: log.puzzle_date || ""
      });
    } catch (error) {
      return jsonResponse({ ok: false, error: error?.message || "GitHub dispatch failed." }, 502);
    }
  }
};

export default worker;
