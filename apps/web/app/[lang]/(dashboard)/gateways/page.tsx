import { cookies } from 'next/headers';
import DeviceToolbar from '../../../../components/devices/DeviceToolbar';
import GatewayCard from '../../../../components/gateway/GatewayCard';
import NewGatewayDialog from '../../../../components/gateway/NewGatewayDialog';
import { GatewayModel } from '../../../../types/gateway';

export const dynamic = 'force-dynamic';

const getUserGateways = async () => {
  try {
    const token = cookies().get('token')?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/gateway`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ['gateways'] },
      },
    );
    const data: GatewayModel[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default async function GatewaysPage() {
  const data = await getUserGateways();
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6 h-full">
        <div className="flex justify-between">
          <DeviceToolbar filter={false} />
        </div>
        <div className="w-full h-full flex flex-col justify-center items-center gap-2">
          <h1 className="text-md text-gray-500">
            No gateways found. Create new one
          </h1>
          <NewGatewayDialog />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between">
        <DeviceToolbar filter={false} />
        <NewGatewayDialog />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((gateway) => (
          <GatewayCard key={gateway.id} gateway={gateway} />
        ))}
      </div>
    </div>
  );
}
