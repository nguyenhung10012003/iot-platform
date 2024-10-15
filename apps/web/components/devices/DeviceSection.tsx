import GatewayCard from './DeviceCard';

export default function DeviceSection() {
  return (
    <div>
      <h2 className="font-bold text-2xl mb-4 border-b">Hubs</h2>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GatewayCard />
        <GatewayCard />
        <GatewayCard />
        <GatewayCard />
      </div>
    </div>
  );
}
