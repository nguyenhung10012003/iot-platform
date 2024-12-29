import { IconProps, Icons } from '@repo/ui/components/icons/icons';
import { Card } from '@repo/ui/components/ui/card';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { DictionaryProps } from '../../types/dictionary';
import { Role } from '../../types/role';

type SidebarItemProps = {
  isCollapsed?: boolean;
  active?: boolean;
  label: string;
  href: string;
  icon: React.FC<IconProps>;
};
const SidebarItem = ({
  label,
  href,
  icon,
  active,
  isCollapsed,
}: SidebarItemProps) => {
  return (
    <Link
      className={`w-full text-sm flex items-center gap-2 p-3 rounded-xxl hover:bg-secondary font-semibold ${active ? 'bg-secondary text-primary' : 'text-accent-foreground/80'}`}
      href={href}
    >
      {icon({ className: `w-6 h-6`, variant: active ? 'solid' : 'outline' })}
      <span className={`${isCollapsed ? 'hidden' : ''}`}>{label}</span>
    </Link>
  );
};

export default function DashboardSidebar({
  role,
  dictionary,
}: { role: Role } & DictionaryProps) {
  const items = [
    {
      id: 'home',
      label: dictionary.home,
      href: '/',
      icon: Icons.home,
      role: ['USER', 'ADMIN', 'EMPLOYEE'],
    },
    {
      id: 'gateway',
      label: dictionary.gateways,
      href: '/gateways',
      icon: Icons.cpu,
      role: ['USER'],
    },
    {
      id: 'devices',
      label: dictionary.devices,
      href: '/devices',
      icon: Icons.device,
      role: ['USER'],
    },
    {
      id: 'device-templates',
      label: dictionary.deviceTemplates,
      href: '/device-templates',
      icon: Icons.device,
      role: ['ADMIN'],
    },
    {
      id: 'locations',
      label: dictionary.locations,
      href: '/locations',
      icon: Icons.mappin,
      role: ['USER', 'EMPLOYEE'],
    },
    // {
    //   id: 'executive',
    //   label: 'Executive structure',
    //   href: '/executive',
    //   icon: Icons.cog,
    //   role: ['USER'],
    // },
    {
      id: 'users',
      label: dictionary.users,
      href: '/users',
      icon: Icons.user,
      role: ['ADMIN'],
    },
  ];

  const pathname = usePathname();
  const path = useMemo(() => `/${pathname.split('/')[2] || ''}`, [pathname]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Card
      onMouseMove={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
      className={`flex h-screen flex-col max-w-[250px] shadow-md rounded-xxl transition-all duration-300 ease-linear ${!isCollapsed ? 'w-full' : ''}`}
    >
      <div className="h-20 border-b transition-all duration-300 ease-linear">
        Logo
      </div>
      <ScrollArea className="w-full h-full p-2 transition-all duration-300 ease-linear">
        {items
          .filter((item) => item.role.includes(role))
          .map((item) => (
            <SidebarItem
              key={item.id}
              label={item.label}
              href={item.href}
              icon={item.icon}
              active={path === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
      </ScrollArea>
      <div className="h-12 border-t p-2 transition-all duration-300 ease-linear">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-sm flex items-center gap-2 p-3 rounded-xxl hover:bg-secondary font-semibold transition-all duration-300 ease-linear"
        >
          {isCollapsed ? (
            <Icons.expand className="w-5 h-5" />
          ) : (
            <>
              <Icons.collapse className="w-5 h-5" />
              <span>{dictionary.hideMenu}</span>
            </>
          )}
        </button>
      </div>
    </Card>
  );
}
