'use client';
import { Icons } from '@repo/ui/components/icons/icons';
import { Badge } from '@repo/ui/components/ui/badge';
import { Button } from '@repo/ui/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui/popover';
import { getCookie } from 'cookies-next';
import { formatDistance } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import useSWR from 'swr';
import api from '../../config/api';
import { useSocket } from '../../hooks/useSocket';
import type { Notification } from '../../types/notification';

const fetcher = (url: string) =>
  api.get<any, Notification[]>(url).then((res) => res);
export default function Notification() {
  const { data: notifications, mutate } = useSWR<Notification[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
    fetcher,
  );
  const userId = getCookie('userId');
  const { socket } = useSocket(userId);

  useEffect(() => {
    if (socket) {
      socket.on('notification', (notification: Notification) => {
        if (notifications) mutate([...notifications, notification], false);
        else {
          mutate([notification], false);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);

  const unreadCount = useMemo(() => {
    return notifications?.filter((n) => n.status === 'UNREAD')?.length || 0;
  }, [notifications]);

  const markAsRead = async (id: string) => {
    try {
      await api.patch('/notifications/mark-as-read', { ids: [id] });
      mutate(
        notifications?.map((n) => {
          if (n.id === id) {
            return { ...n, status: 'READ' };
          }
          return n;
        }),
        false,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllAsRead = () => {
    try {
      const unreadIds = notifications
        ?.filter((n) => n.status === 'UNREAD')
        ?.map((n) => n.id);
      if (unreadIds) {
        api.patch('/notifications/mark-as-read', { ids: unreadIds });
        mutate(
          notifications?.map((n) => {
            if (unreadIds.includes(n.id)) {
              return { ...n, status: 'READ' };
            }
            return n;
          }),
          false,
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const router = useRouter();

  const handleClickNotification = async (notification: Notification) => {
    await markAsRead(notification.id);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const parseNotificationContent = (content: string) => {
    const actionMap: Record<string, string> = {
      addReportJob: 'added a new report job',
      updateStatusJob: 'updated the status of job to you',
      to: 'to',
      assignJob: 'assigned job',
    };

    return content.replace(/\{\{(\w+)\}\}/g, (match, action) => {
      return actionMap[action] || match;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-9 h-9 p-0 rounded-full relative">
          <Icons.notification className="w-5 h-5" />
          {unreadCount !== 0 && (
            <Badge className="absolute top-0 right-0 p-0.5 w-4 h-4 text-[10px] items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="rounded-xl w-[400px] p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b px-4 py-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Notifications</CardTitle>
                <CardDescription className="text-xs">
                  You have {unreadCount} unread notifications
                </CardDescription>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto text-xs px-2 py-1"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto p-0">
            {notifications?.length ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer ${
                      notification.status === 'UNREAD' ? 'bg-muted/30' : ''
                    }`}
                    onClick={() => handleClickNotification(notification)}
                  >
                    <div className="flex-shrink-0 pt-1">
                      {notification.status === 'UNREAD' ? (
                        <span className="block h-2 w-2 rounded-full bg-primary" />
                      ) : (
                        <span className="block h-2 w-2 rounded-full bg-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm ${notification.status === 'UNREAD' ? 'font-medium' : ''}`}
                      >
                        {parseNotificationContent(notification.content)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistance(
                          new Date(notification.createdAt),
                          new Date(),
                          { addSuffix: true },
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No notifications
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
