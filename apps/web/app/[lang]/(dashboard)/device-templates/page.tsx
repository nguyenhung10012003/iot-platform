import dynamic from 'next/dynamic';
import DeviceSection from '../../../../components/devices/DeviceSection';
import DeviceToolbar from '../../../../components/devices/DeviceToolbar';
const NewDeviceTemplateDialog = dynamic(
  () => import('../../../../components/devices/NewDeviceTemplateDialog'),
  { ssr: false },
);
export default function DevicesPage() {
  return (
    <div className="flex flex-col w-full gap-4 p-4 md:p-6">
      <DeviceToolbar />
      <DeviceSection />
    </div>
  );
}
