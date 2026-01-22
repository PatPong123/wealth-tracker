import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'WOXA Wealth Tracker - Track Your Investment Portfolio',
    template: '%s | WOXA Wealth Tracker',
  },
  description:
    'Track your investment portfolio, monitor profit/loss, and visualize asset allocation with WOXA Wealth Tracker. Your personal wealth management solution.',
  keywords: [
    'wealth tracker',
    'portfolio tracker',
    'investment tracking',
    'stock portfolio',
    'asset allocation',
    'profit loss tracker',
  ],
  authors: [{ name: 'WOXA' }],
  creator: 'WOXA',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://woxa-wealth-tracker.com',
    siteName: 'WOXA Wealth Tracker',
    title: 'WOXA Wealth Tracker - Track Your Investment Portfolio',
    description:
      'Track your investment portfolio, monitor profit/loss, and visualize asset allocation with WOXA Wealth Tracker.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'WOXA Wealth Tracker',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WOXA Wealth Tracker',
    description: 'Track your investment portfolio with ease',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
