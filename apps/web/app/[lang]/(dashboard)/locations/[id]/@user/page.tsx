import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import { DeviceTable } from '../../../../../../components/devices/DeviceTable';
import JobTable from '../../../../../../components/location/JobTable';
import UserLocationTable from '../../../../../../components/location/UserLocationTable';

export default function UserLocationPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <Tabs className="flex flex-col gap-4 p-4 md:p-6" defaultValue="devices">
      <TabsList className="w-full border-b">
        <TabsTrigger
          value="devices"
          className="text-lg max-w-[100px] hover:text-primary/70"
        >
          Devices
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="text-lg max-w-[100px] hover:text-primary/70"
        >
          Users
        </TabsTrigger>
        <TabsTrigger
          value="jobs"
          className="text-lg max-w-[100px] hover:text-primary/70"
        >
          Jobs
        </TabsTrigger>
        {/* <TabsTrigger
          value="areas"
          className="text-lg max-w-[100px] hover:text-primary/70"
        >
          Areas
        </TabsTrigger> */}
      </TabsList>
      <TabsContent value="areas">
        <DeviceTable />
      </TabsContent>
      <TabsContent value="devices">
        <DeviceTable />
      </TabsContent>
      <TabsContent value="users">
        <UserLocationTable locationId={params.id} />
      </TabsContent>
      <TabsContent value="jobs">
        <JobTable locationId={params.id} />
      </TabsContent>
    </Tabs>
  );
}
