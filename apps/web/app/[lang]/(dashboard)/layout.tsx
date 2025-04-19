import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import { UserProvider } from '../../../components/contexts/UserContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../config/api';
import { Role } from '../../../types/role';
import { User } from '../../../types/user';
import { getDictionary } from '../../dictionaries';

const getUser = async (userId?: string) => {
  if (!userId) return null;
  try {
    return await api.get<any, User>(`/user/me`);
  } catch (error) {
    return null;
  }
};

export default async function DashboardLayoutPage({
  children,
  params,
}: {
  children: ReactNode;
  params: {
    lang: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);
  const role = (cookies().get('role')?.value || 'USER') as Role;
  const userId = getCookie('userId');
  const user = await getUser(userId);
  return (
    <UserProvider initialUser={user}>
      <DashboardLayout role={role} dictionary={dictionary}>
        {children}
      </DashboardLayout>
    </UserProvider>
  );
}
