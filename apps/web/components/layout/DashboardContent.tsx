import { ReactNode } from 'react';

export default function DashboardContent({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}
