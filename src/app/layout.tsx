import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RootLayoutClient from "./layout-client";
import AiAssistant from '@/components/UI/AiAssistant';
import VisualAlert from '@/components/UI/VisualAlert';
import ScreenReader from '@/components/UI/ScreenReader';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* OpenDyslexic webfont for dyslexic-font accessibility option */}
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/open-dyslexic" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sense Aid" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <script suppressHydrationWarning>
          {`
            try {
              const stored = localStorage.getItem('theme-storage');
              if (stored) {
                const { state } = JSON.parse(stored);
                if (state.currentTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              }
            } catch (e) {}
          `}
        </script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-white`}>
        <RootLayoutClient>{children}</RootLayoutClient>
        <ScreenReader />
        <VisualAlert />
        <AiAssistant />
      </body>
    </html>
  );
}
