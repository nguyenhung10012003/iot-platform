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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui/components/ui/form';
import { Input } from '@repo/ui/components/ui/input';
import { toast } from '@repo/ui/components/ui/sonner';
import { Lock, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../config/api';
import { Token } from '../../types/token';
import { setTokenCookies } from './cookies';
export default function SignupForm() {
  const formSchema = z
    .object({
      username: z
        .string()
        .min(4, { message: 'User name must have more than 4 characters' })
        .max(48, { message: 'User name must have less than 48 characters' }),
      password: z
        .string()
        .min(6, { message: 'Password must have more than 6 characters' })
        .max(32, { message: 'Password must have less than 32 characters' }),
      confirmPassword: z
        .string()
        .min(6, {
          message: 'Confirm Password must have more than 6 characters',
        })
        .max(32, {
          message: 'Confirm Password must have less than 32 characters',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = await api.post<any, Token>('/auth/signup', {
        username: values.username,
        password: values.password,
      });
      setTokenCookies(data);
      router.push('/');
      router.refresh();
    } catch (error: any) {
      switch (error.error) {
        case 'DUPLICATE':
          form.setError('username', {
            type: 'manual',
            message: 'Username already exists',
          });
          break;
        default:
          toast.error('An error occurred', {
            description: 'Something went wrong, please try again later',
            closeButton: true,
            position: 'top-right',
          });
          console.error(error);
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
    {
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Confirm your password',
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
          Sign up
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
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/85 "
            >
              Sign up
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col pt-2 pb-4">
        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
