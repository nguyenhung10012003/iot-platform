'use client';
import { Button } from '@repo/ui/components/ui/button';
import { toast } from '@repo/ui/components/ui/sonner';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import api from '../../config/api';
import { AutomationModel } from '../../types/automation';
import CardImage from '../CardImage';
import AutomationDialog from './AutomationDialog';

const fetcher = (url: string) =>
  api.get<any, AutomationModel[]>(url).then((res) => res);
export default function AutomationSection() {
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

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`automation/${id}`);
      mutate();
      toast.success('Automation deleted');
    } catch (error) {}
  };

  const handleActiveAutomation = async (id: string) => {
    try {
      await api.patch(`automation/${id}/run`);
      mutate();
      toast.success('Automation is running');
    } catch (error) {}
  };
  if (isLoading) return;
  return (
    <div className="w-full ">
      <div className="flex justify-end pb-4">
        <AutomationDialog locationId={id} onSaved={mutate} />
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {data?.map((automation) => (
          <CardImage
            key={automation.id}
            title={automation.name}
            component={
              <div className="flex flex-col gap-2">
                {automation?.condition.type === 'Scene' && (
                  <Button
                    onClick={() => {
                      handleActiveAutomation(automation.id);
                    }}
                  >
                    Run
                  </Button>
                )}
                <AutomationDialog
                  triggerBtn={<Button>Edit</Button>}
                  locationId={id}
                  automation={automation}
                  onSaved={mutate}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(automation.id)}
                >
                  Delete
                </Button>
              </div>
            }
          />
        ))}
      </div>
    </div>
  );
}
