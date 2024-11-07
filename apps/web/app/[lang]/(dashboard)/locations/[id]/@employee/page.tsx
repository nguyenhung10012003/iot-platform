import { getDictionary } from '../../../../../dictionaries';
import JobTable from './JobTable';

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
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <JobTable locationId={params.id} dictionary={dictionary}/>
    </div>
  );
}
