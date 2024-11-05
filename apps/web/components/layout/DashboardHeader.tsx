import { Icons } from '@repo/ui/components/icons/icons';
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
import { useUser } from '../../hooks/useUser';
import ThemeToggle from '../ThemeToggle';
import Link from 'next/link';
import { DictionaryProps } from '../../types/dictionary';

export default function DashboardHeader({ dictionary }: DictionaryProps) {
  const { signout, user } = useUser();
  return (
    <div className="flex justify-end">
      <Card className="rounded-full shadow-md">
        <CardContent className="px-3 py-1 flex items-center justify-end gap-2">
          <ThemeToggle />
          <Button variant="ghost" className="w-9 h-9 p-0 rounded-full">
            <Icons.notification className="w-5 h-5" />
          </Button>
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
                <DropdownMenuItem><Link href="/setting" >{dictionary.settings}</Link></DropdownMenuItem>
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
  );
}
