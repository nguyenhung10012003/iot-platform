'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { toast } from '@repo/ui/components/ui/sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../config/api';
import { DictionaryProps } from '../../types/dictionary';
import { Location, LocationModel } from '../../types/location';
import revalidate from '../../utils/action';
import LocationForm from './LocationForm';

type LocationDialogProps = {
  onSave?: (location: LocationModel) => void;
  location?: LocationModel;
  triggerBtn?: React.ReactNode;
};

export default function LocationDialog({
  triggerBtn,
  location,
  onSave,
  dictionary,
}: LocationDialogProps & DictionaryProps) {
  const [open, setOpen] = useState<boolean>(false);
  const formSchema = z.object({
    name: z.string({ message: dictionary.filedIsRequired }),
    address: z.string({ message: dictionary.filedIsRequired }),
    capacity: z.number(),
    area: z.number(),
    disPerRow: z.number(),
    disPerHole: z.number(),
    fertilizerLevel: z.number(),
    totalHole: z.number(),
    dripRatePerHole: z.number(),
    wateringMode: z.boolean(),
    image: z.instanceof(File).optional(),
  });

  const form = useForm<Location>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: location?.name || '',
      address: location?.address || '',
      capacity: location?.setting?.capacity || 0,
      area: location?.setting?.area || 0,
      disPerRow: location?.setting?.disPerRow || 0,
      disPerHole: location?.setting?.disPerHole || 0,
      fertilizerLevel: location?.setting?.fertilizerLevel || 0,
      totalHole: location?.setting?.totalHole || 0,
      dripRatePerHole: location?.setting?.dripRatePerHole || 0,
      wateringMode: location?.setting?.wateringMode || false,
      image: undefined,
    },
  });

  const onSubmit = async (data: Location) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      if (data.image) {
        formData.append('image', data.image);
      }
      formData.append(
        'setting',
        JSON.stringify({
          capacity: data.capacity,
          area: data.area,
          disPerRow: data.disPerRow,
          disPerHole: data.disPerHole,
          fertilizerLevel: data.fertilizerLevel,
          totalHole: data.totalHole,
          dripRatePerHole: data.dripRatePerHole,
          wateringMode: data.wateringMode,
        }),
      );

      const res = location
        ? await api.patch<any, LocationModel>(
            `/location/${location.id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
        : await api.post<any, LocationModel>('/location', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
      onSave && onSave(res);
      await revalidate('locations');
      toast.success(dictionary.locationSaveSuccessfully);
      handleOpenChange(false);
    } catch (e) {
      toast.error(dictionary.locationSaveFailed);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerBtn ? triggerBtn : <Button>{dictionary.createLocation}</Button>}
      </DialogTrigger>
      <DialogContent className="w-full max-w-[700px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {location ? dictionary.editLocation : dictionary.createLocation}
          </DialogTitle>
          <DialogDescription>
            {location
              ? dictionary.editLocationDetails
              : dictionary.fillInLocationDetails}
          </DialogDescription>
        </DialogHeader>
        <LocationForm form={form} onSubmit={onSubmit} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">{dictionary.cancel}</Button>
          </DialogClose>
          <Button onClick={() => form.handleSubmit(onSubmit)()}>
            {dictionary.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
