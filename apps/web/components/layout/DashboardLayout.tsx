'use client';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import { ReactNode } from 'react';
import { DictionaryProps } from '../../types/dictionary';
import { Role } from '../../types/role';
import DashboardContent from './DashboardContent';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

export default function DashboardLayout({
  children,
  role,
  dictionary,
}: {
  children: ReactNode;
  role: Role;
} & DictionaryProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar role={role} dictionary={dictionary} />
      <ScrollArea className="pt-4 px-4 h-full w-full md:px-8 sm:px-6 transition-all duration-300 ease-linear">
        <DashboardHeader dictionary={dictionary} />
        <DashboardContent>{children}</DashboardContent>
      </ScrollArea>
    </div>
  );
}
