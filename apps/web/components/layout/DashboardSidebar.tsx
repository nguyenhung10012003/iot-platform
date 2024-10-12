import { IconProps, Icons } from '@repo/ui/components/icons/icons';
import { Card } from '@repo/ui/components/ui/card';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useMemo, useState } from 'react';
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

export default function DashboardSidebar({ role }: { role: Role }) {
  const items = [
    {
      id: 'home',
      label: 'Home',
      href: '/',
      icon: Icons.home,
      role: ['USER', 'ADMIN'],
    },
    {
      id: 'devices',
      label: 'Devices',
      href: '/devices',
      icon: Icons.device,
      role: ['USER', 'ADMIN'],
    },
    {
      id: 'locations',
      label: 'Locations',
      href: '/locations',
      icon: Icons.mappin,
      role: ['USER', 'ADMIN'],
    },
    {
      id: 'executive',
      label: 'Executive structure',
      href: '/executive',
      icon: Icons.cog,
      role: ['ADMIN'],
    },
    {
      id: 'users',
      label: 'Users',
      href: '/users',
      icon: Icons.user,
      role: ['ADMIN'],
    },
  ];

  const pathname = usePathname();
  const path = useMemo(() => pathname.split('/')[1] || '/', [pathname]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card
      className={`flex h-screen flex-col max-w-[250px] shadow-md rounded-xxl ${!isCollapsed ? 'w-full' : ''}`}
    >
      <div className="h-20 border-b">Logo</div>
      <ScrollArea className="w-full h-full p-2">
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
      <div className="h-12 border-t p-2">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-sm flex items-center gap-2 p-3 rounded-xxl hover:bg-secondary font-semibold"
        >
          {isCollapsed ? (
            <Icons.expand className="w-5 h-5" />
          ) : (
            <>
              <Icons.collapse className="w-5 h-5" />
              <span>Hide menu</span>
            </>
          )}
        </button>
      </div>
    </Card>
  );
}
