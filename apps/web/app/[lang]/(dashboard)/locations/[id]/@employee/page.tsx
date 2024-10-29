import JobTable from './JobTable';

export default function EmployeeLocationPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <JobTable locationId={params.id} />
    </div>
  );
}
