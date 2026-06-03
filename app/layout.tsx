import type { Metadata } from 'next'
import { Playfair_Display, Lora } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const googleAnalyticsId = 'G-PY6N82V7TH'
const microsoftClarityId = 'x0mm2zk7yj'

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-playfair",
  display: "swap",
})

const lora = Lora({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://puzzleclues.today'),
  manifest: '/manifest.webmanifest',
  title: {
    default: 'Crossclimb Today — Answer, Clues and Full Solution | Puzzle Clues Today',
    template: '%s | Puzzle Clues Today',
  },
  description:
    "Today's Crossclimb answer, clues, and full word ladder solution. Hints you can check before revealing every rung. Updated daily at midnight PT.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Puzzle Clues Today',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${lora.variable} bg-[#F1EFE8]`}>
      <body className="font-sans antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalyticsId}');
          `}
        </Script>
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i+"?ref=bwt";
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${microsoftClarityId}");
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
