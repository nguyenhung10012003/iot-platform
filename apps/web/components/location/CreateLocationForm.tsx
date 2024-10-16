import { Icons } from '@repo/ui/components/icons/icons';
import { Button } from '@repo/ui/components/ui/button';
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
import { useDragDrop } from '../../../../packages/ui/src/hooks/use-drag-drop';
import { Location } from '../../types/location';

type CreateLocationFormProps = {
  onSubmit: (data: Location) => void;
  form: UseFormReturn<Location>;
};

export default function CreateLocationForm({
  form,
  onSubmit,
}: CreateLocationFormProps) {
  const onDrop = (file: File) => {
    form.setValue('image', file);
  };
  const [{ dragActive }, { handleDrag, handleDrop }] = useDragDrop(onDrop);
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="name">Location name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter location name" id="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="address">Address</FormLabel>
              <FormControl>
                <Input
                  id="address"
                  placeholder="Enter location address"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel htmlFor="dropzone-file">
                <FormControl>
                  <div
                    className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer ${
                      dragActive
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-300 bg-gray-50'
                    } hover:bg-gray-100`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <Icons.upload
                        className="w-10 h-10 mb-3 text-gray-400"
                        aria-hidden="true"
                      />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop
                      </p>
                    </div>
                    <Input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) {
                          onChange(file);
                        }
                      }}
                      {...rest}
                    />
                    {value && (
                      <div className="text-sm text-gray-500">
                        Selected file: {value.name}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormLabel>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-end">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
}
