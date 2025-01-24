import DeviceSection from '../../../../components/devices/DeviceSection';
import DeviceToolbar from '../../../../components/devices/DeviceToolbar';
import api from '../../../../config/api';
import { DeviceTemplateModel } from '../../../../types/device-template';
import { getDictionary } from '../../../dictionaries';

const getDeviceTemplates = async () => {
  try {
    const data = await api.get<any, DeviceTemplateModel[]>('device-template');
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const dynamic = 'force-dynamic';

export default async function DevicesPage({
  params,
  searchParams,
}: {
  params: { lang: string };
  searchParams: {
    search: string;
    filter: string;
  };
}) {
  const [dictionary, data] = await Promise.all([
    getDictionary(params.lang),
    getDeviceTemplates(),
  ]);
  console.log(searchParams);
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <DeviceToolbar dictionary={dictionary} />
      <DeviceSection
        deviceTemplates={
          data?.filter((d) => {
            if (!searchParams.search && !searchParams.filter) {
              return true;
            }
            if (searchParams.search) {
              return d.model
                .toLowerCase()
                .includes(searchParams.search.toLowerCase());
            }
            if (searchParams.filter) {
              const filters = searchParams.filter.split(',');
              return filters.includes(d.deviceType);
            }
            return true;
          }) || []
        }
        dictionary={dictionary}
      />
    </div>
  );
}
