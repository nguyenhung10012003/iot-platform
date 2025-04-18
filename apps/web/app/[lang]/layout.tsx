import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Toaster } from '@repo/ui/components/ui/sonner';
import '@repo/ui/globals.css';
import { getCookie } from 'cookies-next';
import { UserProvider } from '../../components/contexts/UserContext';
import { ThemeProvider } from '../../components/providers/ThemeProviders';
import api from '../../config/api';
import { User } from '../../types/user';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Iot Platform',
  description: 'Some thing about the platform',
};

export async function generateStaticParams() {
  return [{ lang: 'vi' }, { lang: 'en' }];
}

const getUser = async (userId?: string) => {
  if (!userId) return null;
  try {
    return await api.get<any, User>(`/user/me`);
  } catch (error) {
    return null;
  }
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const userId = getCookie('userId');
  const user = await getUser(userId);
  return (
    <html suppressHydrationWarning lang={params.lang}>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider initialUser={user}>{children}</UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
