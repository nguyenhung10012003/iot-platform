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
import { GatewayModel } from '../../types/gateway';
import Stepper from '../Stepper';
import NewDeviceForm from './NewDeviceForm';
import SelectTemplate from './SelectTemplate';

type NewDeviceDialogProps = {
  // isOpen: boolean;
  // onClose: () => void;
  onCreate?: () => void;
  triggerBtn?: React.ReactNode;
  template?: DeviceTemplateModel;
  gateway?: GatewayModel;
};

export default function NewDeviceDialog({
  template,
  triggerBtn,
  onCreate,
  gateway,
}: NewDeviceDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [templateChoosen, setTemplateChoosen] = useState<
    DeviceTemplateModel | undefined
  >(template);
  const [gatewayChoosen, setGatewayChoosen] = useState<
    GatewayModel | undefined
  >();
  const [open, setOpen] = useState<boolean>(false);
  const [disabledNext, setDisabledNext] = useState<boolean>(
    templateChoosen === undefined,
  );

  const formSchema = z.object({
    name: z.string({ message: 'Field is required' }),
    serialNumber: z.string({ message: 'Field is required' }),
    areaId: z.string({ message: 'Field is required' }),
    topic: z.string({ message: 'Field is required' }),
    gatewayId: z.string({ message: 'Field is required' }),
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
      onCreate && onCreate();
      toast.success('Device created successfully');
      setOpen(false);
    } catch (e) {
      toast.error('Failed to create device');
    }
  };

  const steps = [
    {
      component: () => (
        <>
          <div>
            <h1 className="text-lg font-semibold mb-2">Choose a template</h1>
            {!template && (
              <SelectTemplate
                chooseTemplate={template}
                onSelect={(t) => {
                  setTemplateChoosen(t);
                  setDisabledNext(false);
                }}
              />
            )}
          </div>
          {templateChoosen && (
            <div className="flex py-2">
              <div className="w-full flex flex-col">
                <h2 className="font-semibold text-lg">{`Model Name: ${templateChoosen.model}`}</h2>
                <span className="">{`Description: ${templateChoosen.description || 'No description for this template'}`}</span>
                <span>{`Device Type: ${templateChoosen.deviceType}`}</span>
                <span>{`Year of Manufacture: ${templateChoosen.year}`}</span>
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
    },
    {
      component: () => <NewDeviceForm form={form} />,
    },
  ];
  const totalSteps = steps.length;

  const handleNext = () => {
    const step = steps[currentStep - 1];
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
    // if (step && step.next) {
    //   step.next();
    // }
    if (currentStep === totalSteps) {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCurrentStep(1);
      form.reset();
      setTemplateChoosen(template);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerBtn || <Button variant="secondary">Add Device</Button>}
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
        {steps[currentStep - 1] && steps[currentStep - 1]?.component()}
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
