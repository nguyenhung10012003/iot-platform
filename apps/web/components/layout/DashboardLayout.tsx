import { ReactNode } from 'react';
import { Role } from '../../types/role';
import DashboardContent from './DashboardContent';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({
  children,
  role,
}: {
  children: ReactNode;
  role: Role;
}) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar role={role}/>
      <div className="flex flex-col gap-4">
        <DashboardHeader />
        <DashboardContent>{children}</DashboardContent>
      </div>
    </div>
  );
}
