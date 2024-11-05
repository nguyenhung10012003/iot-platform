'use client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@repo/ui/components/ui/alert-dialog';
import { Button } from '@repo/ui/components/ui/button';
import { toast } from '@repo/ui/components/ui/sonner';
import api from '../../config/api';
import { DictionaryProps } from '../../types/dictionary';
import { LocationModel } from '../../types/location';
import revalidate from '../../utils/action';

export default function DeleteLocationDialog({
  location,
  dictionary,
}: {
  location: LocationModel;
} & DictionaryProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">{dictionary.delete}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dictionary.areYouSureToDelete}</AlertDialogTitle>
          <AlertDialogDescription>
            {dictionary.thisActionCannotBeUndone}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{dictionary.cancel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                await api.delete(`location/${location.id}`);
                revalidate('locations');
                toast.success(dictionary.locationDeleteSuccessfully);
              } catch (error) {
                toast.error(dictionary.locationDeleteFailed);
              }
            }}
          >
            {dictionary.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
