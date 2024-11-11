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
import { DictionaryProps } from '../../types/dictionary';
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
  dictionary,
  onCreate,
  gateway,
}: NewDeviceDialogProps & DictionaryProps) {
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
    name: z.string({ message: dictionary.fieldIsRequired }),
    serialNumber: z.string({ message: dictionary.fieldIsRequired }),
    areaId: z.string({ message: dictionary.fieldIsRequired }),
    topic: z.string({ message: dictionary.fieldIsRequired }),
    gatewayId: z.string({ message: dictionary.fieldIsRequired }),
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
      toast.success(dictionary.deviceCreatedSuccessfully);
      setOpen(false);
    } catch (e) {
      toast.error(dictionary.failedToCreateDevice);
    }
  };

  const steps = [
    {
      component: () => (
        <>
          <div>
            <h1 className="text-lg font-semibold mb-2">
              {dictionary.chooseATemplate}
            </h1>
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
                <h2 className="font-semibold text-lg">{`${dictionary.modelName}: ${templateChoosen.model}`}</h2>
                <span className="">{`Description: ${templateChoosen.description || dictionary.noDescriptionForThis}`}</span>
                <span>{`${dictionary.deviceType}: ${templateChoosen.deviceType}`}</span>
                <span>{`${dictionary.yearOfManufacture}: ${templateChoosen.year}`}</span>
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
      component: () => <NewDeviceForm form={form} dictionary={dictionary} />,
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
        {triggerBtn || (
          <Button variant="secondary">{dictionary.addDevice}</Button>
        )}
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
            {dictionary.back}
          </Button>
          <Button onClick={handleNext} disabled={disabledNext}>
            {currentStep === totalSteps ? dictionary.done : dictionary.next}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
