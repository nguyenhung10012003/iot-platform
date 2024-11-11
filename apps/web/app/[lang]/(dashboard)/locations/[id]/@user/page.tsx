import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import { DeviceTable } from '../../../../../../components/devices/DeviceTable';
import UserLocationTable from '../../../../../../components/location/UserLocationTable';
import JobTable from './JobTable';
import HumidityChart from '../../../../../../components/charts/HumidityChart';
import WaterAmountChart from '../../../../../../components/charts/WaterAmountChart';
import ProductivityChart from '../../../../../../components/charts/ProductivityChart';
import { getDictionary } from '../../../../../dictionaries';

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
        {/* <TabsTrigger
          value="areas"
          className="text-lg max-w-[100px] hover:text-primary/70"
        >
          Areas
        </TabsTrigger> */}
      </TabsList>
      {/* <TabsContent value="areas">
        <DeviceTable dictionary={dictionary}/>
      </TabsContent> */}
      <TabsContent value="devices">
        <DeviceTable dictionary={dictionary} locationId={params.id}/>
      </TabsContent>
      <TabsContent value="users">
        <UserLocationTable locationId={params.id} dictionary={dictionary}/>
      </TabsContent>
      <TabsContent value="jobs">
        <JobTable locationId={params.id} dictionary={dictionary}/>
      </TabsContent>
      <TabsContent value="charts">
        <HumidityChart />
        <WaterAmountChart />
        <ProductivityChart />
      </TabsContent>
    </Tabs>
  );
}
