import {
  ArrowUpTrayIcon as ArrowUpTrayIconOutline,
  BellIcon as BellIconOutline,
  BoltIcon as BoltIconOutline,
  CheckIcon as CheckIconOutline,
  CogIcon as CogIconOutline,
  CpuChipIcon as CpuChipIconOutline,
  HomeIcon as HomeIconOutline,
  MagnifyingGlassIcon as MagnifyingGlassIconOutline,
  MapPinIcon as MapPinIconOutline,
  PlusIcon as PlusIconOutline,
  UserIcon as UserIconOutline,
  PencilIcon as PencilIconOutline,
  ClockIcon as ClockIconOutline,
  CommandLineIcon as CommandLineIconOutline,
} from '@heroicons/react/24/outline';
import {
  ArrowUpTrayIcon,
  BellIcon,
  BoltIcon,
  CheckIcon,
  CogIcon,
  CpuChipIcon,
  HomeIcon,
  MapPinIcon,
  PlusIcon,
  UserIcon,
  PencilIcon,
  ClockIcon,
  CommandLineIcon,
} from '@heroicons/react/24/solid';

import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon, MoreHorizontal, ArrowUpDown } from 'lucide-react';

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
};
