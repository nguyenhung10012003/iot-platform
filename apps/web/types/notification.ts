export type Notification = {
  id: string;
  content: string;
  sendToUserId: string;
  creatorId: string;
  status: 'READ' | 'UNREAD';
  createdAt: string;
};
