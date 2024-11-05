import { cookies } from 'next/headers';
import CardImage from '../../../../components/CardImage';

import { Button } from '@repo/ui/components/ui/button';
import DeleteLocationDialog from '../../../../components/location/DeleteLocationDialog';
import LocationDialog from '../../../../components/location/LocationDialog';
import Searchbox from '../../../../components/Searchbox';
import { LocationModel } from '../../../../types/location';
import { getDictionary } from '../../../dictionaries';

const getUserLocations = async () => {
  try {
    const token = cookies().get('token')?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/location/join`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        next: { tags: ['locations'] },
      },
    );
    const data: LocationModel[] = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const dynamic = 'force-dynamic';

export default async function LocationsPage({
  params,
}: {
  params: {
    lang: string;
  };
}) {
  const [dictionary, data] = await Promise.all([
    getDictionary(params.lang),
    getUserLocations(),
  ]);
  const role = cookies().get('role')?.value;

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full flex-col">
        <p className="text-lg text-gray-500">{dictionary.noLocationFound}</p>
        <LocationDialog dictionary={dictionary} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex justify-between">
        <Searchbox boxClassName="bg-popover border shadow-sm shadow-primary/20 rounded-md" />
        {role === 'USER' && <LocationDialog dictionary={dictionary} />}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data?.map((location) => (
          <CardImage
            key={location.id}
            title={location.name}
            description={location.address}
            image={location.image}
            href={`/locations/${location.id}`}
            component={
              role === 'USER' ? (
                <div className="flex flex-col gap-2">
                  <LocationDialog
                    dictionary={dictionary}
                    location={location}
                    triggerBtn={<Button>{dictionary.details}</Button>}
                  />
                  <DeleteLocationDialog location={location} dictionary={dictionary}/>
                </div>
              ) : null
            }
          />
        ))}
      </div>
    </div>
  );
}
