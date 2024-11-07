import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import useSWR from 'swr';
import api from '../../config/api';
import { JobForm as JobFormType } from '../../types/job';
import { UserLocation } from '../../types/user';
import { DictionaryProps } from '../../types/dictionary';

type JobFormProps = {
  locationId: string;
  form: UseFormReturn<JobFormType>;
};

const fetcher = async (url: string) =>
  api.get<any, UserLocation[]>(url).then((res) => res);
export default function JobForm({ form, locationId, dictionary }: JobFormProps & DictionaryProps) {
  const { data, isLoading } = useSWR(
    `location/user?locationId=${locationId}&role=EMPLOYEE`,
    fetcher,
  );
  if (isLoading) {
    return;
  }
  return (
    <Form {...form}>
      <form>
        <FormField
          name="title"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.title}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.description}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="asigneeId"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>{dictionary.assignee}</FormLabel>
                <Select onValueChange={field.onChange}>
                  <SelectTrigger>
                    <FormControl>
                      <SelectValue
                        placeholder={dictionary.enterUsernameAssignee}
                        defaultValue={field.value}
                      ></SelectValue>
                    </FormControl>
                  </SelectTrigger>
                  <SelectContent>
                    {data?.map((ul) => (
                      <SelectItem key={ul.user.id} value={ul.user.id}>
                        {ul.user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </form>
    </Form>
  );
}
