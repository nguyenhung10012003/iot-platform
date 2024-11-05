import dynamic from 'next/dynamic';
import DeviceSection from '../../../../components/devices/DeviceSection';
import DeviceToolbar from '../../../../components/devices/DeviceToolbar';
import api from '../../../../config/api';
import { DeviceTemplateModel } from '../../../../types/device-template';
import { getDictionary } from '../../../dictionaries';
const NewDeviceTemplateDialog = dynamic(
  () => import('../../../../components/devices/NewDeviceTemplateDialog'),
  { ssr: false },
);
export default async function DeviceTemplatesPage({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);
  console.log(dictionary);
  try {
    const data = await api.get<any, DeviceTemplateModel[]>('device-template');
    return (
      <div className="flex flex-col w-full gap-4 p-4 md:p-6">
        <div className="flex w-full justify-between">
          <DeviceToolbar />
          <NewDeviceTemplateDialog />
        </div>
        <DeviceSection deviceTemplates={data} />
      </div>
    );
  } catch (error) {}
}
