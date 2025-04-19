'use client';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import {
  Autoplay,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@repo/ui/components/ui/carousel';
import React from 'react';
import Image from 'next/image';
export default function Banner() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false }),
  );
  return (
    <Carousel
      className="w-full"
      opts={{
        loop: true,
      }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        <CarouselItem>
          <div className="p-1">
            <Card className="p-0">
              <CardContent className="flex aspect-video items-center justify-center p-0">
                <Image
                  src={'/image/banner1.jpeg'}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-md"
                  alt="banner"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
        <CarouselItem>
          <div className="p-1">
            <Card className="p-0">
              <CardContent className="flex aspect-video items-center justify-center p-0">
                <Image
                  src={'/image/banner2.jpeg'}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover rounded-md"
                  alt="banner"
                />
              </CardContent>
            </Card>
          </div>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
