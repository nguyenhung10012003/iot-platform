import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/ui/components/ui/tabs';
import DiseaseDetect from '../../../../../../components/disease/DiseaseDetect';
import DiseaseDetectHistory from '../../../../../../components/disease/DiseaseDetectHistory';
import { getDictionary } from '../../../../../dictionaries';
import JobKanbanBoard from '../@user/JobKanbanBoard';

export default async function EmployeeLocationPage({
  params,
}: {
  params: {
    lang: string;
    id: string;
  };
}) {
  const dictionary = await getDictionary(params.lang);
  return (
    <Tabs className="flex flex-col gap-4 p-4 md:p-6" defaultValue="jobs">
      <TabsList className="w-full border-b overflow-x-auto overflow-y-hidden md:h-10 h-12">
        <TabsTrigger
          value="jobs"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Job
        </TabsTrigger>
        <TabsTrigger
          value="disease-detect"
          className="text-lg max-w-[130px] hover:text-primary/70"
        >
          Disease detect
        </TabsTrigger>
      </TabsList>
      <TabsContent value="jobs">
        <JobKanbanBoard locationId={params.id} dictionary={dictionary} />
      </TabsContent>
      <TabsContent value="disease-detect">
        <div className="space-y-4">
          <DiseaseDetect />
          <DiseaseDetectHistory />
        </div>
      </TabsContent>
    </Tabs>
  );
}
