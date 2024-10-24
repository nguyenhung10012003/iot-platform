import { Card } from '@repo/ui/components/ui/card';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="shadow-lg flex flex-row w-full md:max-w-[800px] max-w-md overflow-hidden">
        <div className="flex-1 hidden md:flex">
          <Image
            src="https://iotplatf.s3.ap-southeast-1.amazonaws.com/agri.jpg"
            width={500}
            height={500}
            alt=""
            className="object-cover flex w-full h-full"
            priority
          />
        </div>
        <div className="flex-1">{children}</div>
      </Card>
    </div>
  );
}
