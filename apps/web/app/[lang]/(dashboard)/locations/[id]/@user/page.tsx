import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import AutomationSection from '../../../../../../components/automation/AutomationSection';
import { DeviceTable } from '../../../../../../components/devices/DeviceTable';
import ChartSection from '../../../../../../components/location/ChartSection';
import IrrigationHistory from '../../../../../../components/location/IrrigationHistory';
import UserLocationTable from '../../../../../../components/location/UserLocationTable';
import { getDictionary } from '../../../../../dictionaries';
import JobTable from './JobTable';

export default async function UserLocationPage({
  params,
}: {
  params: {
    lang: string;
    id: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);
  return (
    <Tabs className="flex flex-col gap-4 p-4 md:p-6" defaultValue="devices">
      <TabsList className="w-full border-b">
        <TabsTrigger
          value="devices"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          {dictionary.devices}
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          {dictionary.users}
        </TabsTrigger>
        <TabsTrigger
          value="jobs"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          {dictionary.jobs}
        </TabsTrigger>
        <TabsTrigger
          value="charts"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          {dictionary.charts}
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
      </TabsList>
      {/* <TabsContent value="areas">
        <DeviceTable dictionary={dictionary}/>
      </TabsContent> */}
      <TabsContent value="devices">
        <DeviceTable dictionary={dictionary} locationId={params.id} />
      </TabsContent>
      <TabsContent value="users">
        <UserLocationTable locationId={params.id} dictionary={dictionary} />
      </TabsContent>
      <TabsContent value="jobs">
        <JobTable locationId={params.id} dictionary={dictionary} />
      </TabsContent>
      <TabsContent value="charts">
        <ChartSection locationId={params.id} dictionary={dictionary} />
      </TabsContent>
      <TabsContent value="automations">
        <AutomationSection dictionary={dictionary} />
      </TabsContent>
      <TabsContent value="irrigation">
        <IrrigationHistory locationId={params.id} />
      </TabsContent>
    </Tabs>
  );
}
