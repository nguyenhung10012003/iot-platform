import { zodResolver } from '@hookform/resolvers/zod';
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
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../config/api';
import { Device } from '../../types/device';
import { DeviceTemplateModel } from '../../types/device-template';
import Stepper from '../Stepper';
import NewDeviceForm from './NewDeviceForm';

type NewDeviceDialogProps = {
  // isOpen: boolean;
  // onClose: () => void;
  // onCreate: () => void;
  template: DeviceTemplateModel;
};

export default function NewDeviceDialog({ template }: NewDeviceDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);
  const totalSteps = 4;

  const formSchema = z.object({
    name: z.string(),
    serialNumber: z.string(),
    areaId: z.string(),
  });

  const form = useForm<Device>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (formData: Device) => {
    try {
      const res = await api.post('/device', {
        ...formData,
        templateId: template.id,
        deviceType: template.deviceType,
      });
    } catch (e) {
      toast.error('Failed to create device');
    }
  };

  const steps = [
    {
      component: (
        <div className="flex py-2">
          <div className="w-full flex flex-col">
            <h2 className="font-semibold text-lg">{`Model name: ${template.model}`}</h2>
            <span className="">{`Description: ${template.description || 'No description for this!'}`}</span>
            <span>{`Device Type: ${template.deviceType}`}</span>
            <span>{`Year of manufacture: ${template.year}`}</span>
          </div>
          <Image
            src={template.image || '/image/device.svg'}
            alt="image"
            className="w-[100px] h-[100px] object-cover"
            width={300}
            height={300}
          />
        </div>
      ),
      next: () => {},
    },
    {
      component: <div>Step 2</div>,
      next: () => {},
    },
    {
      component: <div>Step 3</div>,
      next: () => {},
    },
    {
      component: <NewDeviceForm form={form} />,
    },
  ];

  const handleNext = () => {
    const step = steps[currentStep - 1];
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
    if (step && step.next) {
      step.next();
    }
    if (currentStep === totalSteps) {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCurrentStep(1);
      form.reset();
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">Add device</Button>
      </DialogTrigger>
      <DialogContent
        includeX={false}
        // onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription asChild>
            <Stepper totalSteps={totalSteps} currentStep={currentStep} />
          </DialogDescription>
        </DialogHeader>
        {steps[currentStep - 1] && steps[currentStep - 1]?.component}
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setCurrentStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="bg-muted hover:bg-muted/90"
          >
            Back
          </Button>
          <Button onClick={handleNext}>
            {currentStep === totalSteps ? 'Done' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
