import DeviceSection from '../../../../components/devices/DeviceSection';
import DeviceToolbar from '../../../../components/devices/DeviceToolbar';
import api from '../../../../config/api';
import { DeviceTemplateModel } from '../../../../types/device-template';

export default async function DevicesPage() {
  try {
    const data = await api.get<any, DeviceTemplateModel[]>('device-template');
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <DeviceToolbar />
        <DeviceSection deviceTemplates={data} />
      </div>
    );
  } catch (error) {
    console.error(error);
  }
}
