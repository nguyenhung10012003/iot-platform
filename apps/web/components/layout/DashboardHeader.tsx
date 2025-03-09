'use client';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@repo/ui/components/ui/avatar';
import { Button } from '@repo/ui/components/ui/button';
import { Card, CardContent } from '@repo/ui/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui/dropdown-menu';
import Link from 'next/link';
import { useUser } from '../../hooks/useUser';
import { DictionaryProps } from '../../types/dictionary';
import Notification from '../notification/Notification';
import ThemeToggle from '../ThemeToggle';
import { SSEProvider } from 'react-hooks-sse';
import { getCookie } from 'cookies-next';

export default function DashboardHeader({ dictionary }: DictionaryProps) {
  const { signout, user } = useUser();
  const userId = getCookie('userId');
  return (
    <SSEProvider endpoint={`${process.env.NEXT_PUBLIC_API_URL}/notifications/sse/${userId}`}>
      <div className="flex justify-end">
        <Card className="rounded-full shadow-md">
          <CardContent className="px-3 py-1 flex items-center justify-end gap-2">
            <ThemeToggle />
            <Notification />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative  rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="" alt="AD" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">@1234</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.role || 'USER'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>{dictionary.profile}</DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/setting">{dictionary.settings}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>{dictionary.newLocation}</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signout()}>
                  {dictionary.signout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>
    </SSEProvider>
  );
}
