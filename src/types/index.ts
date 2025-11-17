export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  location: string;
  date: string;
  status: 'lost' | 'found' | 'claimed';
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Report {
  id: string;
  itemId: string;
  itemTitle: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface Metrics {
  totalUsers: number;
  totalItems: number;
  activeReports: number;
  itemsFound: number;
}
