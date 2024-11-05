'use client';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import Image from 'next/image';
import { useState } from 'react';
import { DeviceTemplateModel } from '../../types/device-template';
import NewDeviceDialog from './NewDeviceDialog';
import { DictionaryProps } from '../../types/dictionary';

type DeviceCardProps = {
  deviceTemplate: DeviceTemplateModel;
};

export default function DeviceCard({ deviceTemplate, dictionary }: DeviceCardProps & DictionaryProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Image
          src={deviceTemplate.image || '/image/device.svg'}
          alt="Card image"
          className="w-full h-[200px] object-cover"
          width={300}
          height={200}
        />
        <div
          className={`absolute inset-0 flex items-center justify-center bg-opacity-50 transition-opacity duration-300 bg-gray-400 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <NewDeviceDialog template={deviceTemplate} dictionary={dictionary}/>
        </div>
      </div>
      <CardHeader>
        <CardTitle>{deviceTemplate.model}</CardTitle>
        <CardDescription>{deviceTemplate.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
