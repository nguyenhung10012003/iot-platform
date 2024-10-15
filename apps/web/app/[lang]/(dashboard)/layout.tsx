import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Role } from '../../../types/role';

export default function DashboardLayoutPage({
  children,
}: {
  children: ReactNode;
}) {
  const role = (cookies().get('role')?.value || 'USER') as Role;
  return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
