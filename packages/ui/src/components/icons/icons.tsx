import {
  ArrowUpTrayIcon as ArrowUpTrayIconOutline,
  BellIcon as BellIconOutline,
  BoltIcon as BoltIconOutline,
  CheckIcon as CheckIconOutline,
  ClockIcon as ClockIconOutline,
  CogIcon as CogIconOutline,
  CommandLineIcon as CommandLineIconOutline,
  CpuChipIcon as CpuChipIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  MapPinIcon as MapPinIconOutline,
  PencilIcon as PencilIconOutline,
  PlusIcon as PlusIconOutline,
  UserIcon as UserIconOutline,
  XCircleIcon as XCircleIconOutline,
} from '@heroicons/react/24/outline';
import {
  ArrowUpTrayIcon,
  BellIcon,
  BoltIcon,
  CheckIcon,
  ClockIcon,
  CogIcon,
  CommandLineIcon,
  CpuChipIcon,
  HomeIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  UserIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';

import {
  ArrowLeftFromLineIcon,
  ArrowRightFromLineIcon,
  ArrowUpDown,
  CloudHail,
  Droplets,
  MoreHorizontal,
  ThermometerSun,
  Waves,
  Wind,
} from 'lucide-react';

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

  cpu: (props: IconProps) =>
    props.variant === 'solid' ? (
      <CpuChipIcon {...props} />
    ) : (
      <CpuChipIconOutline {...props} />
    ),

  cog: (props: IconProps) =>
    props.variant === 'solid' ? (
      <CogIcon {...props} />
    ) : (
      <CogIconOutline {...props} />
    ),

  expand: (props: IconProps) => <ArrowRightFromLineIcon {...props} />,

  collapse: (props: IconProps) => <ArrowLeftFromLineIcon {...props} />,

  plus: (props: IconProps) =>
    props.variant === 'solid' ? (
      <PlusIcon {...props} />
    ) : (
      <PlusIconOutline {...props} />
    ),

  upload: (props: IconProps) =>
    props.variant === 'solid' ? (
      <ArrowUpTrayIcon {...props} />
    ) : (
      <ArrowUpTrayIconOutline {...props} />
    ),

  check: (props: IconProps) =>
    props.variant === 'solid' ? (
      <CheckIcon {...props} />
    ) : (
      <CheckIconOutline {...props} />
    ),

  more: (props: IconProps) => <MoreHorizontal {...props} />,

  sort: (props: IconProps) => <ArrowUpDown {...props} />,

  edit: (props: IconProps) =>
    props.variant === 'solid' ? (
      <PencilIcon {...props} />
    ) : (
      <PencilIconOutline {...props} />
    ),

  clock: (props: IconProps) =>
    props.variant === 'solid' ? (
      <ClockIcon {...props} />
    ) : (
      <ClockIconOutline {...props} />
    ),

  command: (props: IconProps) =>
    props.variant === 'solid' ? (
      <CommandLineIcon {...props} />
    ) : (
      <CommandLineIconOutline {...props} />
    ),

  close: (props: IconProps) =>
    props.variant === 'solid' ? (
      <XCircleIcon {...props} />
    ) : (
      <XCircleIconOutline {...props} />
    ),

  soil: (props: IconProps) => <Waves {...props} />,

  water: (props: IconProps) => <Droplets {...props} />,

  temperature: (props: IconProps) => <ThermometerSun {...props} />,

  rain: (props: IconProps) => <CloudHail {...props} />,

  wind: (props: IconProps) => <Wind {...props} />,
};
