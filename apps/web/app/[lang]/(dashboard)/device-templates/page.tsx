import dynamicImport from 'next/dynamic';
import { cookies } from 'next/headers';
import DeviceTemplateSection from '../../../../components/devices/DeviceTemplateSection';
import DeviceToolbar from '../../../../components/devices/DeviceToolbar';
import { DeviceTemplateModel } from '../../../../types/device-template';
import { getDictionary } from '../../../dictionaries';
const NewDeviceTemplateDialog = dynamicImport(
  () => import('../../../../components/devices/DeviceTemplateDialog'),
  { ssr: false },
);

export const dynamic = 'force-dynamic';
const getDeviceTemplates = async () => {
  try {
    const token = cookies().get('token')?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/device-template`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ['device-templates'] },
      },
    );
    const data: DeviceTemplateModel[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export default async function DeviceTemplatesPage({
  params,
  searchParams,
}: {
  params: {
    lang: string;
  };
  searchParams: {
    search: string;
    filter: string;
  }
}) {
  const [dictionary, data] = await Promise.all([
    getDictionary(params.lang),
    getDeviceTemplates(),
  ]);

  return (
    <div className="flex flex-col w-full gap-4 p-4 md:p-6">
      <div className="flex w-full justify-between">
        <DeviceToolbar dictionary={dictionary} />
        <NewDeviceTemplateDialog dictionary={dictionary} />
      </div>
      <DeviceTemplateSection
        deviceTemplates={data?.filter((d) => {
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
        }) || []}
        dictionary={dictionary}
      />
    </div>
  );
}
