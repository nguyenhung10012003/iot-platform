import { Icons } from '@repo/ui/components/icons/icons';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Switch } from '@repo/ui/components/ui/switch';
import { UseFormReturn } from 'react-hook-form';
import { useDragDrop } from '../../../../packages/ui/src/hooks/use-drag-drop';
import { Location } from '../../types/location';

type LocationFormProps = {
  onSubmit: (data: Location) => void;
  form: UseFormReturn<Location>;
};

export default function LocationForm({ form, onSubmit }: LocationFormProps) {
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
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="name">Location name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter location name"
                    id="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="w-full">
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
        </div>
        <div>
          <h1 className="text-md font-semibold mt-4">Location Setting</h1>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-x-6">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel htmlFor="capacity" className="w-1/2">
                    Capacity:
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="Enter capacity"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel htmlFor="area" className="w-1/2">
                    Area (m²):
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="area"
                      type="number"
                      placeholder="Enter area"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="disPerRow"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel htmlFor="disPerRow" className="w-1/2">
                    {`Distance per Row (cm):`}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="disPerRow"
                      type="number"
                      placeholder="Enter distance per row"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="disPerHole"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel htmlFor="disPerHole" className="w-1/2">
                    {`Distance per Hole (cm):`}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="disPerHole"
                      type="number"
                      placeholder="Enter distance per hole"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fertilizerLevel"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel htmlFor="fertilizerLevel" className="w-1/2">
                    Fertilizer Level:
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="fertilizerLevel"
                      type="number"
                      placeholder="Enter fertilizer level"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalHole"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel htmlFor="totalHole" className="w-1/2">
                    Total Hole:
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="totalHole"
                      type="number"
                      placeholder="Enter total hole"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dripRatePerHole"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormLabel htmlFor="dripRatePerHole" className="w-1/2">
                    {`Drip Rate per Hole (l/h/hole):`}
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="dripRatePerHole"
                      type="number"
                      step={0.1}
                      placeholder="Enter drip rate per hole"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(+e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="wateringMode"
              render={({ field }) => (
                <FormItem className="flex items-center justify-start">
                  <FormLabel htmlFor="wateringMode" className="w-1/2">
                    Watering Mode:
                  </FormLabel>
                  <FormControl>
                    <Switch
                      id="wateringMode"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
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
      </form>
    </Form>
  );
}
