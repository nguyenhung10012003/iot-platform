'use client';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
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
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar role={role} />
      <ScrollArea className="py-4 px-4 h-full w-full md:px-8 sm:px-6">
        <DashboardHeader />
        <DashboardContent>{children}</DashboardContent>
      </ScrollArea>
    </div>
  );
}
