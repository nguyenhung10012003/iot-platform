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
import SelectTemplate from './SelectTemplate';

type NewDeviceDialogProps = {
  // isOpen: boolean;
  // onClose: () => void;
  // onCreate: () => void;
  triggerBtn?: React.ReactNode;
  template?: DeviceTemplateModel;
};

export default function NewDeviceDialog({
  template,
  triggerBtn,
}: NewDeviceDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [templateChoosen, setTemplateChoosen] = useState<
    DeviceTemplateModel | undefined
  >(template);
  const [open, setOpen] = useState<boolean>(false);
  const [disabledNext, setDisabledNext] = useState<boolean>(true);
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
        templateId: templateChoosen?.id,
        deviceType: templateChoosen?.deviceType,
      });
    } catch (e) {
      toast.error('Failed to create device');
    }
  };

  const steps = [
    {
      component: (
        <>
          <div>
            <h1 className="text-lg font-semibold mb-2">Choose a template</h1>
            <SelectTemplate
              chooseTemplate={templateChoosen}
              onSelect={(template) => {
                setTemplateChoosen(template), setDisabledNext(false);
              }}
            />
          </div>
          {templateChoosen && (
            <div className="flex py-2">
              <div className="w-full flex flex-col">
                <h2 className="font-semibold text-lg">{`Model name: ${templateChoosen.model}`}</h2>
                <span className="">{`Description: ${templateChoosen.description || 'No description for this!'}`}</span>
                <span>{`Device Type: ${templateChoosen.deviceType}`}</span>
                <span>{`Year of manufacture: ${templateChoosen.year}`}</span>
              </div>
              <Image
                src={templateChoosen.image || '/image/device.svg'}
                alt="image"
                className="w-[100px] h-[100px] object-cover"
                width={300}
                height={300}
              />
            </div>
          )}
        </>
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
      setTemplateChoosen(undefined);
      setDisabledNext(true);
      form.reset();
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerBtn || <Button variant="secondary">Add device</Button>}
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
          <Button onClick={handleNext} disabled={disabledNext}>
            {currentStep === totalSteps ? 'Done' : 'Next'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
