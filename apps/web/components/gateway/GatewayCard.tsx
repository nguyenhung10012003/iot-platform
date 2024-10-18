'use client';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import Image from 'next/image';
import { GatewayModel } from '../../types/gateway';

type GatewayCardProps = {
  gateway: GatewayModel;
};

export default function GatewayCard({ gateway }: GatewayCardProps) {
  return (
    <Card className="w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg">
      <div className="relative">
        <Image
          src={'/image/device.svg'}
          alt="Card image"
          className="w-full h-[200px] object-cover"
          width={300}
          height={200}
        />
      </div>
      <CardHeader className="px-4">
        <CardTitle className="text-xl">{gateway.name}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
    </Card>
  );
}
