import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SimpleSheet MVP',
  description: 'Campaign tracking replacement for Smartsheet + Data Shuttle',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
