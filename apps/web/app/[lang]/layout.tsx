import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@repo/ui/components/ui/sonner';
import '@repo/ui/globals.css';
import { UserProvider } from '../../components/contexts/UserContext';
import { ThemeProvider } from '../../components/providers/ThemeProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Iot Platform',
  description: 'Some thing about the platform',
};

export async function generateStaticParams() {
  return [{ lang: 'vi' }, { lang: 'en' }];
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html suppressHydrationWarning lang={params.lang}>
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
