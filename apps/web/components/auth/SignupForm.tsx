'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
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
import { DictionaryProps } from '../../types/dictionary';
import { Token } from '../../types/token';
import { setTokenCookies } from './cookies';
export default function SignupForm({ dictionary }: DictionaryProps) {
  const formSchema = z
    .object({
      username: z
        .string({ message: dictionary.filedIsRequired })
        .min(4, { message: dictionary.usernameMustBeAtLeast4Characters })
        .max(48, { message: dictionary.usernameMustBeAtMost48Characters }),
      password: z
        .string({ message: dictionary.filedIsRequired })
        .min(6, { message: dictionary.passwordMustBeAtLeast6Characters })
        .max(32, { message: dictionary.passwordMustBeAtMost32Characters }),
      confirmPassword: z
        .string({ message: dictionary.filedIsRequired })
        .min(6, {
          message: dictionary.confirmPasswordMustBeAtLeast6Characters,
        })
        .max(32, {
          message: dictionary.confirmPasswordMustBeAtMost32Characters,
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: dictionary.passwordsDoNotMatch,
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
            message: dictionary.usernameAlreadyExists,
          });
          break;
        default:
          toast.error(dictionary.anErrorOccurred, {
            description: `${dictionary.somethingWentWrong}, ${dictionary.pleaseTryAgainLater}`,
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
      label: dictionary.username,
      placeholder: dictionary.enterUsername,
      type: 'text',
      icon: (
        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      ),
    },
    {
      name: 'password',
      label: dictionary.password,
      placeholder: dictionary.enterPassword,
      type: 'password',
      icon: (
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      ),
    },
    {
      name: 'confirmPassword',
      label: dictionary.confirmPassword,
      placeholder: dictionary.enterConfirmPassword,
      type: 'password',
      icon: (
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
      ),
    },
  ];
  return (
    <>
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
              {dictionary.signup}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col pt-2 pb-4">
        <p className="text-sm text-center">
          {`${dictionary.alreadyHaveAnAccount}? `}
          <Link href="/signin" className="text-blue-600 hover:underline">
            {dictionary.signin}
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
