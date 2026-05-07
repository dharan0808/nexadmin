import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'NexAdmin — Modern Dashboard',
  description: 'A stunning Next.js admin dashboard with MUI, Zustand & DummyJSON',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
