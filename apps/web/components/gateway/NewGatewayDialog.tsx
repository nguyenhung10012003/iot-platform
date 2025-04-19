'use client';

import { Button } from '@repo/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/components/ui/dialog';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/components/ui/select';
import { toast } from '@repo/ui/components/ui/sonner';
import { Textarea } from '@repo/ui/components/ui/textarea';
import { AlertCircle, CheckCircle, Keyboard, QrCode } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../../config/api';
import { LocationModel } from '../../types/location';
import revalidate from '../../utils/action';
import SelectLocation from '../location/SelectLocation';
import QRScanner from '../QrReader';

type NewGatewayDialogProps = {
  triggerBtn?: React.ReactNode;
};

export default function NewGatewayDialog({
  triggerBtn,
}: NewGatewayDialogProps) {
  const [method, setMethod] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [gatewayInfo, setGatewayInfo] = useState<any>(null);
  const [connectedStatus, setConnectedStatus] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationModel | undefined>();
  const [areaId, setAreaId] = useState<string | null>(null);
  const [host, setHost] = useState<string | null>(null);
  const [port, setPort] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMethod(null);
      setConnectedStatus(null);
      setGatewayInfo(null);
    }
  }, [open]);

  const onQRScan = (result: string) => {
    try {
      const data = JSON.parse(result);
      setGatewayInfo(data);
    } catch (error) {
      setConnectedStatus('error');
    }
  };

  const connectGateway = async () => {
    try {
      setConnectedStatus('connecting');
      const res = await api.post<any, { status: string }>(
        'gateway/test-connection',
        method === 'qr' ? gatewayInfo : { host, port },
      );
      if (res.status === 'success') {
        setConnectedStatus('connected');
      } else {
        setConnectedStatus('error');
      }
    } catch (error) {
      setConnectedStatus('error');
    }
  };

  const onSave = async () => {
    try {
      const res = await api.post<any, { status: string }>('gateway', {
        name,
        description,
        areaId,
        ...gatewayInfo,
      });
      revalidate('gateways');
      setOpen(false);
      toast.success('Tạo gateway thành công');
    } catch (error) {
      toast.error('Tạo gateway thất bại');
    }
  };

  useEffect(() => {
    if (gatewayInfo) {
      connectGateway();
    }
  }, [gatewayInfo]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerBtn || <Button>New gateway</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Connect new gateway</DialogTitle>
          <DialogDescription>
            Connect new gateway to your account
          </DialogDescription>
        </DialogHeader>
        {!method && (
          <div className="flex gap-4">
            <div
              className="bg-card p-4 w-full rounded-lg border hover:bg-accent cursor-pointer flex gap-4 transition-all duration-300"
              onClick={() => setMethod('qr')}
            >
              <QrCode size={30} className="flex-none" />
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold ">QR Code</h2>
                <p className="text-sm text-muted-foreground">
                  Connect your gateway to the system via QR code
                </p>
              </div>
            </div>
            <div
              className="bg-card p-4 w-full  rounded-md border hover:bg-accent cursor-pointer flex gap-4 transition-all duration-300"
              onClick={() => setMethod('manual')}
            >
              <Keyboard size={30} className="flex-none" />
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Manual</h2>
                <p className="text-sm text-muted-foreground">
                  Connect your gateway manually by entering the connection info
                </p>
              </div>
            </div>
          </div>
        )}

        {method === 'qr' && !connectedStatus && (
          <div className="flex flex-col gap-4">
            <QRScanner
              onResult={(result) => {
                onQRScan(result);
              }}
            />
          </div>
        )}

        {method === 'manual' && !connectedStatus && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                value={host || ''}
                onChange={(e) => setHost(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                value={port || ''}
                onChange={(e) => setPort(e.target.value)}
              />
            </div>
            <Button onClick={connectGateway}>Test connection</Button>
          </div>
        )}
        {connectedStatus === 'connecting' && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Connecting to gateway</p>
              <p className="text-sm text-muted-foreground">
                Please wait while we establish the connection...
              </p>
            </div>
          </div>
        )}

        {connectedStatus === 'error' && (
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-lg font-medium">Connection Failed</p>
              <p className="text-sm text-muted-foreground max-w-sm">
                We couldn't establish a connection with the gateway. Please
                check your connection and try again.
              </p>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setConnectedStatus(null);
                  setGatewayInfo(null);
                  setMethod(null);
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        )}

        {connectedStatus === 'connected' && (
          <div className="flex flex-col  gap-4 w-full">
            <div className="bg-green-50 flex gap-2 p-4 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <span className="text-sm text-muted-foreground">
                You have successfully connected to the gateway. Now set the name
                and description for your gateway.
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name || ''}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <Label htmlFor="location">Location</Label>
                  <SelectLocation onSelect={setLocation} />
                </div>
                <div className="flex gap-2 flex-col w-full">
                  <Label htmlFor="area">Area</Label>
                  <Select onValueChange={setAreaId} disabled={!location}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      {location?.areas?.map((area) => (
                        <SelectItem key={area.id} value={area.id}>
                          {area.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 w-full justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Hủy
              </Button>
              <Button onClick={onSave}>Lưu</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
