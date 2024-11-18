'use client';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import api from '../../config/api';
import { AutomationModel } from '../../types/automation';
import { DictionaryProps } from '../../types/dictionary';
import CardImage from '../CardImage';
import AutomationDialog from './AutomationDialog';

const fetcher = (url: string) =>
  api.get<any, AutomationModel[]>(url).then((res) => res);
export default function AutomationSection({ dictionary }: DictionaryProps) {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error, mutate } = useSWR(
    `automation?locationId=${id}`,
    fetcher,
    {
      refreshInterval: 0,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );
  console.log(data);
  if (isLoading) return;
  return (
    <div className="w-full ">
      <div className="flex justify-end pb-4">
        <AutomationDialog
          locationId={id}
          dictionary={dictionary}
          onSaved={mutate}
        />
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {data?.map((automation) => (
          <CardImage key={automation.id} title={automation.name} />
        ))}
      </div>
    </div>
  );
}
