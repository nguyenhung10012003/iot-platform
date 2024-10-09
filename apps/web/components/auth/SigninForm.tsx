'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import { Checkbox } from '@repo/ui/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { Label } from '@repo/ui/components/ui/label';
import { toast } from '@repo/ui/components/ui/sonner';
import { Lock, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../config/api';
import { Token } from '../../types/token';
import { setTokenCookies } from './cookies';

export default function SigninForm() {
  const formSchema = z.object({
    username: z.string(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = await api.post<any, Token>('/auth/signin', values);
      setTokenCookies(data);
      router.push('/');
      router.refresh();
      toast.success('Welcome back!', {
        description: 'You have successfully signed in',
        closeButton: true,
        position: 'top-right',
      });
    } catch (error: any) {
      switch (error.error) {
        case 'NOTFOUND':
          form.setError('username', {
            type: 'manual',
            message: 'User not found',
          });
          break;
        case 'Unauthorized': {
          form.setError('password', {
            type: 'manual',
            message: 'Password is incorrect',
          });
          break;
        }
        default: {
          console.error(error);
        }
      }
    }
  };

  const fields = [
    {
      name: 'username',
      label: 'User name',
      placeholder: 'Enter your username',
      type: 'text',
      icon: (
        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      ),
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      type: 'password',
      icon: (
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      ),
    },
  ];
  return (
    <Card className="max-w-md w-full shadow-lg">
      <CardHeader className="">
        <CardTitle className="text-2xl font-bold text-center">
          Sign in
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {fields.map((f) => (
              <FormField
                key={f.name}
                control={form.control}
                name={f.name as 'username' | 'password'}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={f.name}>{f.label}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {f.icon}
                        <Input
                          {...field}
                          placeholder={f.placeholder}
                          className="pl-10"
                          type={f.type}
                          id={f.name}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/85 "
            >
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col pt-2 pb-4">
        <p className="text-sm text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
