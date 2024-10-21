'use client';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

type CardImageProps = {
  title: string;
  description?: string;
  image?: string;
  href?: string;
  component?: React.ReactNode;
};

const Base = ({ title, description, image, component }: CardImageProps) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Card
      className="w-full overflow-hidden transition-all duration-300 ease-in-out transform hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <Image
          src={image || '/image/device.svg'}
          alt="Card image"
          className="w-full h-[200px] object-cover"
          width={300}
          height={200}
        />
        {component && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-opacity-50 transition-opacity duration-300 bg-gray-400 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {component}
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default function CardImage(props: CardImageProps) {
  if (props.href) {
    return (
      <Link href={props.href} prefetch={false}>
        <Base {...props} />
      </Link>
    );
  }
  return <Base {...props} />;
}
