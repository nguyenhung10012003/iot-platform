import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { DictionaryProps } from '../../types/dictionary';

type AddUserForm = {
  username: string;
  password: string;
};

export default function AddUserForm({
  form,
  onSubmit,
  dictionary
}: {
  form: UseFormReturn<AddUserForm>;
  onSubmit: (values: AddUserForm) => void;
} & DictionaryProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="username">{dictionary.username}</FormLabel>
              <FormControl>
                <Input {...field} id="username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">{dictionary.password}</FormLabel>
              <FormControl>
                <Input {...field} id="password" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
