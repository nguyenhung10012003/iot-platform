import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { ScrollArea } from '@repo/ui/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/components/ui/tooltip';
import { UserIcon } from 'lucide-react';
import { useMemo } from 'react';
import { User } from '../../types/user';

interface UserAvatarGroupProps {
  users: User[];
  onUserClick?: (user: User) => void;
  maxAvatars?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatarGroup({
  users,
  maxAvatars = 5,
  size = 'md',
  onUserClick,
}: UserAvatarGroupProps) {
  const { visibleUsers, remainingUsers, hasMoreUsers } = useMemo(() => {
    const visibleUsers = users.slice(0, maxAvatars);
    const remainingUsers =
      users.length > maxAvatars ? users.slice(maxAvatars) : [];
    const hasMoreUsers = remainingUsers.length > 0;
    return { visibleUsers, remainingUsers, hasMoreUsers };
  }, [users, maxAvatars]);

  // Size classes based on the size prop
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {visibleUsers.length ? (
          visibleUsers.map((user) => (
            <Tooltip key={user.id}>
              <TooltipTrigger asChild>
                <div
                  className="transition-transform hover:translate-y-[-1px] cursor-pointer"
                  onClick={() => onUserClick?.(user)}
                >
                  <Avatar
                    className={`border-2 border-background ${sizeClasses[size]}`}
                  >
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {getInitials(user.name || user.username)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.username}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar
                className={`bg-muted text-muted-foreground border-2 border-background cursor-pointer ${sizeClasses[size]}`}
              >
                <AvatarFallback>
                  <UserIcon className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">No users</p>
            </TooltipContent>
          </Tooltip>
        )}

        {hasMoreUsers && (
          <Popover>
            <PopoverTrigger asChild>
              <div className="transition-transform hover:translate-y-[-1px]">
                <Avatar
                  className={`bg-muted text-muted-foreground border-2 border-background cursor-pointer ${sizeClasses[size]}`}
                >
                  <AvatarFallback>+{remainingUsers.length}</AvatarFallback>
                </Avatar>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Other Users</h4>
                <ScrollArea className="max-h-[300px] overflow-y-auto space-y-2">
                  {remainingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 p-1 cursor-pointer"
                      onClick={() => onUserClick?.(user)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {getInitials(user.name || user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </TooltipProvider>
  );
}
