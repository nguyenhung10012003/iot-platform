'use client';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Action, ActionType } from '../../types/automation';
import { DictionaryProps } from '../../types/dictionary';
import ChooseDevice from './ChooseDevice';
import { Switch } from '@repo/ui/components/ui/switch';

type AddActionDialogProps = {
  actionDefault?: Action;
  trigger?: React.ReactNode;
  onAdd?: (action?: Action) => void;
  actionFilters?: { type: ActionType; label: string; description: string }[];
  allowAI?: boolean;
};

export default function AddActionDialog({
  actionDefault,
  trigger,
  onAdd,
  actionFilters,
  allowAI,
}: AddActionDialogProps) {
  const [action, setAction] = useState<Action | undefined>(actionDefault);
  const [open, setOpen] = useState(false);
  const { id }: { id: string } = useParams();

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setAction(undefined);
    }
  };

  const actionContent = useMemo(() => {
    if (action?.type === 'SendEmail') {
      return (
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Receiver email</Label>
            <Input
              type="email"
              value={action.toEmail}
              onChange={(e) =>
                setAction({ ...action, toEmail: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input
              value={action.title}
              onChange={(e) => setAction({ ...action, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={action.body}
              onChange={(e) => setAction({ ...action, body: e.target.value })}
            />
          </div>
        </div>
      );
    } else if (action?.type === 'TurnOff' || action?.type === 'TurnOn') {
      return (
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label>Choose device</Label>
            <ChooseDevice
              locationId={id}
              defaultValue={action?.deviceId}
              onChange={(value) => setAction({ ...action, deviceId: value })}
              deviceTypes={['LIGHT_BULB', 'DOME', 'VALVE']}
            />
          </div>
        </div>
      );
    } else if (action?.type === 'Watering') {
      return (
        <div className='flex flex-col gap-4'>
          {allowAI && <div className='flex justify-between items-center'>
            <Label>Use AI</Label>
            <Switch checked={action.useAI} onCheckedChange={(value) => setAction({...action, useAI: value})}/>
          </div>}
          {(!action.useAI || !allowAI) && (
            <Label className="flex items-center">
              Watering duration in:&nbsp;
              <Input
                type="number"
                value={action.time}
                onChange={(e) => setAction({ ...action, time: parseInt(e.target.value) })}
                className='max-w-14 h-auto p-1'
              />
              &nbsp;seconds
            </Label>
          )}
        </div>
      )
    }
  }, [action]);
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || <Button>Add Action</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Action</DialogTitle>
        </DialogHeader>

        {!action?.type && (
          <div className="flex flex-col gap-4">
            {actionFilters?.map((a) => (
              <Card
                className="flex p-4 gap-4 items-center hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
                onClick={() => setAction({ type: a.type })}
              >
                <div>
                  <h2 className="text-lg font-semibold">{a.label}</h2>
                  <p className="text-sm text-gray-500">{a.description}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {actionContent}
        <DialogFooter>
          <Button
            onClick={() => {
              onAdd?.(action);
              handleOpenChange(false);
            }}
          >
            {'Add'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
