import {
  BellIcon as BellIconOutline,
  BoltIcon as BoltIconOutline,
  CogIcon as CogIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  MapPinIcon as MapPinIconOutline,
  UserIcon as UserIconOutline,
} from '@heroicons/react/24/outline';
import {
  BellIcon,
  BoltIcon,
  CogIcon,
  HomeIcon,
  MapPinIcon,
  UserIcon,
} from '@heroicons/react/24/solid';

import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from 'lucide-react';

export type IconProps = React.HTMLAttributes<SVGElement> & {
  variant?: 'outline' | 'solid';
};

export const Icons = {
  home: (props: IconProps) =>
    props.variant === 'solid' ? (
      <HomeIcon {...props} />
    ) : (
      <HomeIconOutline {...props} />
    ),

  search: (props: IconProps) =>
    props.variant === 'solid' ? (
      <MagnifyingGlassIconOutline strokeWidth={2.5} {...props} />
    ) : (
      <MagnifyingGlassIconOutline {...props} />
    ),

  notification: (props: IconProps) =>
    props.variant === 'solid' ? (
      <BellIcon {...props} />
    ) : (
      <BellIconOutline {...props} />
    ),

  user: (props: IconProps) =>
    props.variant === 'solid' ? (
      <UserIcon {...props} />
    ) : (
      <UserIconOutline {...props} />
    ),

  mappin: (props: IconProps) =>
    props.variant === 'solid' ? (
      <MapPinIcon {...props} />
    ) : (
      <MapPinIconOutline {...props} />
    ),

  device: (props: IconProps) =>
    props.variant === 'solid' ? (
      <BoltIcon {...props} />
    ) : (
      <BoltIconOutline {...props} />
    ),

  cog: (props: IconProps) =>
    props.variant === 'solid' ? (
      <CogIcon {...props} />
    ) : (
      <CogIconOutline {...props} />
    ),

  expand: (props: IconProps) => <ArrowRightFromLineIcon {...props} />,

  collapse: (props: IconProps) => <ArrowLeftFromLineIcon {...props} />,
};
