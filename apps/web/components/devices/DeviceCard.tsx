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

export default function DeviceCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Image
          src="/image/device.svg"
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
          <Button variant="secondary">Add device</Button>
        </div>
      </div>
      <CardHeader>
        <CardTitle>Hub Title</CardTitle>
        <CardDescription>Some description about the hub.</CardDescription>
      </CardHeader>
    </Card>
  );
}
