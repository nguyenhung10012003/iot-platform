import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';

import { Toaster } from '@repo/ui/components/ui/sonner';
import '@repo/ui/globals.css';
import dynamic from 'next/dynamic';
import { UserProvider } from '../components/contexts/UserContext';
import { ThemeProvider } from '../components/providers/ThemeProviders';
const ThemeToggle = dynamic(() => import('../components/ThemeToggle'), {
  ssr: false,
});

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Iot Platform',
  description: 'Some thing about the platform',
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>{children}</UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
