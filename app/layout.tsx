import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import {Providers} from '@/components/Providers';
import './globals.css';
import 'katex/dist/katex.min.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Growix — Business Intelligence Platform',
  description:
    'AI-powered growth platform for Ethiopian businesses. Strategy, marketing, analytics, and insights.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body
        className="bg-bg text-text antialiased selection:bg-gray selection:text-heading font-sans"
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
