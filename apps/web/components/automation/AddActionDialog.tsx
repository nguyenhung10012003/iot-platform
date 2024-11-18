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
import { useState } from 'react';
import { Action, ActionType } from '../../types/automation';

type AddActionDialogProps = {
  trigger?: React.ReactNode;
  onAdd?: (action?: Action) => void;
  actionFilters?: { type: ActionType; label: string; description: string }[];
};

export default function AddActionDialog({
  trigger,
  onAdd,
  actionFilters,
}: AddActionDialogProps) {
  const [action, setAction] = useState<Action | undefined>();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setAction(undefined);
    }
  };
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

        {action?.type === 'SendEmail' && (
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
                onChange={(e) =>
                  setAction({ ...action, title: e.target.value })
                }
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
        )}
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
