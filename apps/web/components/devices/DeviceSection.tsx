import { DeviceTemplateModel } from '../../types/device-template';
import DeviceCard from './DeviceCard';

type DeviceSectionProps = {
  deviceTemplates: DeviceTemplateModel[];
};

export default function DeviceSection({ deviceTemplates }: DeviceSectionProps) {
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template) => (
              <DeviceCard key={template.id} deviceTemplate={template} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
