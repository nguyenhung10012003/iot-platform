import { cookies } from "next/headers";
import api from "../../../../../config/api";
import { User } from "../../../../../types/user";
import { redirect } from "next/navigation";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@repo/ui/components/ui/tabs";

const getUser = async (userId: string) => {
  try {
    const res = await api.get<any, User>(`/user/${userId}`);
    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUser(params.userId);
  console.log(user);
  const role = cookies().get('role')?.value;
  if (role !== 'ADMIN') {
    redirect('/');
  }
  return (
    <Tabs defaultValue="locations">
      <TabsList>
        <TabsTrigger value="locations">Locations</TabsTrigger>
        <TabsTrigger value="gateways">Gateways</TabsTrigger>
        <TabsTrigger value="devices">Devices</TabsTrigger>
      </TabsList>
      <TabsContent value="locations">
        <div>Locations</div>
      </TabsContent>
      <TabsContent value="gateways">
        <div>Gateways</div>
      </TabsContent>
    </Tabs>
  );
}
