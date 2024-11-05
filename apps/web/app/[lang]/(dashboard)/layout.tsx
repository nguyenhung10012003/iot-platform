import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Role } from '../../../types/role';
import { getDictionary } from '../../dictionaries';

export default async function DashboardLayoutPage({
  children,
  params,
}: {
  children: ReactNode;
  params: {
    lang: string;
  }
}) {
  const dictionary = await getDictionary(params.lang);
  const role = (cookies().get('role')?.value || 'USER') as Role;
  return <DashboardLayout role={role} dictionary={dictionary}>{children}</DashboardLayout>;
}
