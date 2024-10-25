import { cookies } from 'next/headers';

export default async function LocationPageLayout({
  user,
  employee,
}: {
  children: React.ReactNode;
  user: React.ReactNode;
  employee: React.ReactNode;
}) {
  const role = cookies().get('role')?.value;
  if (role === 'USER') {
    return user;
  }
  return employee;
}
