'use client';
import { deleteCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useEffect, useState } from 'react';
import api from '../../config/api';
import { User } from '../../types/user';

type UserContextType = {
  user: User | null;
  setUser: (user: User) => void;
  signout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const fetchUser = useCallback(async () => {
    const userId = getCookie('userId');
    if (!userId) return null;
    try {
      return await api.get<any, User>(`/user/me`);
    } catch (error) {
      return null;
    }
  }, []);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUser().then((user) => setUser(user));
  }, [fetchUser]);
  const router = useRouter();

  const signout = () => {
    setUser(null);
    deleteCookie('userId');
    deleteCookie('role');
    deleteCookie('token');
    deleteCookie('refreshToken');
    router.push('/signin');
  };

  return (
    <UserContext.Provider value={{ user, setUser, signout }}>
      {children}
    </UserContext.Provider>
  );
};
