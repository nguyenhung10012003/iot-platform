'use client';

import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { toast } from '@repo/ui/components/ui/sonner';
import { useState } from 'react';
import api from '../../config/api';
import SearchUserInput from './SearchUserInput';

export default function AddUserLocationDialog({
  locationId,
  onAddUser,
}: {
  locationId: string;
  onAddUser: () => void;
}) {
  const [searchValue, setSearchValue] = useState('');
  const [open, setOpen] = useState(false);

  const handleAddUser = async () => {
    try {
      if (!searchValue) return;
      await api.post('location/user', {
        role: 'EMPLOYEE',
        locationId: locationId,
        username: searchValue,
      });
      onAddUser();
      toast.success('User added successfully');
      setOpen(false);
    } catch (error: any) {
      switch (error.error) {
        case 'DUPLICATE':
          toast.error('Failed to add user. User already exists in location');
          break;
        case 'NOT_FOUND':
          toast.error('Failed to add user. User not found');
          break;
        default:
          toast.error('Failed to add user');
          break;
      }
    }
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    setSearchValue('');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add user</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new user</DialogTitle>
          <DialogDescription>
            Find and add user to your location
          </DialogDescription>
        </DialogHeader>
        <div>
          <SearchUserInput
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => handleAddUser()} disabled={!searchValue}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
