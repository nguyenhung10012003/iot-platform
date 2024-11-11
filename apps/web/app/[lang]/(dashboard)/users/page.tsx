import { cookies } from 'next/headers';
import UserTable from '../../../../components/user/UserTable';
import { User } from '../../../../types/user';
import { getDictionary } from '../../../dictionaries';

export const dynamic = 'force-dynamic';
const getUser = async () => {
  try {
    const token = cookies().get('token')?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/user`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ['users'] },
      },
    );
    const data: User[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default async function UserPage({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const [dictionary, data] = await Promise.all([
    getDictionary(params.lang),
    getUser(),
  ]);
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <UserTable dictionary={dictionary} data={data || []} />
    </div>
  );
}
