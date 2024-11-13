'use client';
import { Button } from '@repo/ui/components/ui/button';
import { toast } from '@repo/ui/components/ui/sonner';
import api from '../../config/api';
import { GatewayModel } from '../../types/gateway';
import revalidate from '../../utils/action';
import CardImage from '../CardImage';

type GatewayCardProps = {
  gateway: GatewayModel;
};

export default function GatewayCard({ gateway }: GatewayCardProps) {
  return (
    <CardImage
      title={gateway.name}
      image="/image/device.svg"
      component={
        <Button
          onClick={async () => {
            try {
              await api.delete(`/gateway/${gateway.id}`);
              revalidate('gateway');
            } catch (error) {
              toast.error('Could not delete gateway');
            }
          }}
          variant="secondary"
        >
          Delete
        </Button>
      }
    />
  );
}
