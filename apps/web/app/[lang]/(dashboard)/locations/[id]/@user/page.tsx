'use client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import AutomationSection from '../../../../../../components/automation/AutomationSection';
import { DeviceTable } from '../../../../../../components/devices/DeviceTable';
import DiseaseDetectHistory from '../../../../../../components/disease/DiseaseDetectHistory';
import ChartSection from '../../../../../../components/location/ChartSection';
import IrrigationHistory from '../../../../../../components/location/IrrigationHistory';
import UserLocationTable from '../../../../../../components/location/UserLocationTable';
import JobKanbanBoard from './JobKanbanBoard';
import { useRouter } from 'next/navigation';

export default function UserLocationPage({
  params,
  searchParams,
}: {
  params: {
    lang: string;
    id: string;
  };
  searchParams: {
    tab: string;
  };
}) {
  const router = useRouter();
  const onTabChange = (value: string) => {
    router.push(`/locations/${params.id}?tab=${value}`);
  }
  return (
    <Tabs className="flex flex-col gap-4 p-4 md:p-6" defaultValue={searchParams.tab || 'devices'} onValueChange={onTabChange}>
      <TabsList className="w-full border-b overflow-x-auto overflow-y-hidden md:h-10 h-12">
        <TabsTrigger
          value="devices"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Devices
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Users
        </TabsTrigger>
        <TabsTrigger
          value="jobs"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Jobs
        </TabsTrigger>
        <TabsTrigger
          value="charts"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Charts
        </TabsTrigger>
        <TabsTrigger
          value="automations"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Automations
        </TabsTrigger>
        {/* <TabsTrigger
          value="areas"
          className="text-lg max-w-[100px] hover:text-primary/70"
        >
          Areas
        </TabsTrigger> */}
        <TabsTrigger
          value="irrigation"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Tưới tiêu
        </TabsTrigger>
        <TabsTrigger
          value="disease-detect"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Disease detect
        </TabsTrigger>
      </TabsList>
      {/* <TabsContent value="areas">
        <DeviceTable dictionary={dictionary}/>
      </TabsContent> */}
      <TabsContent value="devices">
        <DeviceTable locationId={params.id} />
      </TabsContent>
      <TabsContent value="users">
        <UserLocationTable locationId={params.id} />
      </TabsContent>
      <TabsContent value="jobs">
        {/* <JobTable locationId={params.id} dictionary={dictionary} /> */}
        <JobKanbanBoard locationId={params.id} />
      </TabsContent>
      <TabsContent value="charts">
        <ChartSection locationId={params.id} />
      </TabsContent>
      <TabsContent value="automations">
        <AutomationSection />
      </TabsContent>
      <TabsContent value="irrigation">
        <IrrigationHistory locationId={params.id} />
      </TabsContent>
      <TabsContent value="disease-detect">
        <DiseaseDetectHistory canDelete />
      </TabsContent>
    </Tabs>
  );
}
