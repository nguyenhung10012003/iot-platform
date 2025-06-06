'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@repo/ui/components/ui/button';
import {
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
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import api from '../../config/api';
import {
  authenticateWithGoogle,
  signInWithGoogle,
} from '../../config/firebase';
import { DictionaryProps } from '../../types/dictionary';
import { Token } from '../../types/token';
import { setTokenCookies } from './cookies';

export default function SigninForm({ dictionary }: DictionaryProps) {
  const formSchema = z.object({
    username: z.string({ message: dictionary.filedIsRequired }),
    password: z.string({ message: dictionary.filedIsRequired }),
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = await api.post<any, Token>('/auth/signin', values);
      setTokenCookies(data);
      router.push('/home');
      router.refresh();
      toast.success(`${dictionary.welcomeBack}!`, {
        description: dictionary.youHaveSuccessfullySignin,
        closeButton: true,
        position: 'top-right',
      });
    } catch (error: any) {
      switch (error.error) {
        case 'NOTFOUND':
          form.setError('username', {
            type: 'manual',
            message: dictionary.userNotFound,
          });
          break;
        case 'Unauthorized': {
          form.setError('password', {
            type: 'manual',
            message: dictionary.wrongPassword,
          });
          break;
        }
        default: {
          console.error(error);
        }
      }
    }
  };
  /**
   * Handles Google OAuth login
   */
  async function handleGoogleLogin() {
    try {
      setError(null);
      setIsLoading(true);

      const idToken = await signInWithGoogle();
      const data = await authenticateWithGoogle(idToken);
      setTokenCookies(data);
      router.push('/');
      router.refresh();
      toast.success(`${dictionary.welcomeBack}!`, {
        description: dictionary.youHaveSuccessfullySignin,
        closeButton: true,
        position: 'top-right',
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to login with Google',
      );
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  }

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
  ];
  return (
    <>
      <CardHeader className="">
        <CardTitle className="text-2xl font-bold text-center">
          {dictionary.signin}
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
                  {dictionary.rememberMe}
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
              >
                {dictionary.forgotPassword}
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/85 "
            >
              {dictionary.signin}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full mt-2 mb-2"
              disabled={isLoading}
              onClick={handleGoogleLogin}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Continue with Google
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col pt-2 pb-4">
        <p className="text-sm text-center">
          {dictionary.dontHaveAnAccount}
          {'? '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            {dictionary.registerHere}
          </Link>
        </p>
      </CardFooter>
    </>
  );
}
