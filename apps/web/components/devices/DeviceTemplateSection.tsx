'use client';
import { Button } from '@repo/ui/components/ui/button';
import { toast } from '@repo/ui/components/ui/sonner';
import api from '../../config/api';
import { DeviceTemplateModel } from '../../types/device-template';
import { DictionaryProps } from '../../types/dictionary';
import revalidate from '../../utils/action';
import CardImage from '../CardImage';
import DeviceTemplateDialog from './DeviceTemplateDialog';

type DeviceSectionProps = {
  deviceTemplates: DeviceTemplateModel[];
};

export default function DeviceTemplateSection({
  deviceTemplates,
  dictionary,
}: DeviceSectionProps & DictionaryProps) {
  const groupedTemplates = deviceTemplates.reduce(
    (acc, template) => {
      (acc[template.deviceType] = acc[template.deviceType] || []).push(
        template,
      );
      return acc;
    },
    {} as Record<string, DeviceTemplateModel[]>,
  );

  return (
    <>
      {Object.entries(groupedTemplates).map(([deviceType, templates]) => (
        <div key={deviceType}>
          <h2 className="font-bold text-2xl mb-4 border-b">{deviceType}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <CardImage
                key={template.id}
                title={template.model}
                description={template.description}
                image={template.image || '/image/device.svg'}
                component={
                  <div className="flex flex-col gap-2">
                    <DeviceTemplateDialog
                      dictionary={dictionary}
                      template={template}
                      trigerBtn={<Button>{dictionary.edit}</Button>}
                    />
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await api.delete(`/device-template/${template.id}`);
                          revalidate('device-templates');
                        } catch (error) {
                          toast.error(dictionary.errorOccurred);
                        }
                      }}
                    >
                      {dictionary.delete}
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
