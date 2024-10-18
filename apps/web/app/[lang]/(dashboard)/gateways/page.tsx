import DeviceToolbar from '../../../../components/devices/DeviceToolbar';
import NewGatewayDialog from '../../../../components/gateway/NewGatewayDialog';

export default async function GatewaysPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between">
        <DeviceToolbar filter={false} />
        <NewGatewayDialog />
      </div>
    </div>
  );
}
