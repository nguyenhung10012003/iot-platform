import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import useSWR from 'swr';
import api from '../../config/api';
import { DeviceTemplateModel } from '../../types/device-template';

const fetcher = (url: string) =>
  api.get<any, DeviceTemplateModel[]>(url).then((res) => res);

type SelectTemplateProps = {
  chooseTemplate?: DeviceTemplateModel;
  onSelect: (template: DeviceTemplateModel) => void;
};
export default function SelectTemplate({
  onSelect,
  chooseTemplate,
}: SelectTemplateProps) {
  const { data, error, isLoading } = useSWR('/device-template', fetcher);

  if (isLoading) {
    return;
  }

  const onValueChange = (value: string) => {
    onSelect(
      data?.find((template) => template.id === value) as DeviceTemplateModel,
    );
  };

  return (
    <Select onValueChange={onValueChange} defaultValue={chooseTemplate?.id}>
      <SelectTrigger className="w-full" defaultValue={chooseTemplate?.id}>
        <SelectValue
          placeholder="Choose template"
          defaultValue={chooseTemplate?.id}
        />
      </SelectTrigger>
      <SelectContent>
        {data?.map((template) => (
          <SelectItem key={template.id} value={template.id}>
            {template.model}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
