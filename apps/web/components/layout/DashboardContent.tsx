import { Card } from '@repo/ui/components/ui/card';
import { ReactNode } from 'react';
import { DictionaryProps } from '../../types/dictionary';

export default function DashboardContent({
  children,
}: {
  children: ReactNode;
}) {
  return <Card className="h-full mt-4">{children}</Card>;
}
