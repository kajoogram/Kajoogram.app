
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification, NotificationUser } from '../types';

interface NotificationContextType {
  notifications: Notification[];
  users: NotificationUser[]; // Mock database of users for search
  sendNotification: (notification: Notification) => void;
  getUser: (id: string) => NotificationUser | undefined;
}

// Mock User Database for Admin Search
const MOCK_USERS: NotificationUser[] = [
  { id: 'u-101', username: 'Sophia Styles', email: 'sophia@example.com', avatar: 'https://picsum.photos/id/64/200/200' },
  { id: 'u-102', username: 'Rahul Gamer', email: 'rahul@example.com', avatar: 'https://picsum.photos/id/65/200/200' },
  { id: 'u-103', username: 'LuxuryLover', email: 'luxury@example.com', avatar: 'https://picsum.photos/id/66/200/200' },
  { id: 'u-104', username: 'Priya Sharma', email: 'priya@example.com', avatar: 'https://picsum.photos/id/67/200/200' },
  { id: 'u-105', username: 'Arjun Tech', email: 'arjun@example.com', avatar: 'https://picsum.photos/id/68/200/200' },
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    type: 'broadcast',
    targetUserName: 'All Users',
    message: 'Welcome to the new festive collection! 50% OFF on all ethnic wear.',
    image: 'https://picsum.photos/id/101/400/200',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isRead: false
  },
  {
    id: 'notif-2',
    type: 'personal',
    targetUserId: 'u-101',
    targetUserName: 'Sophia Styles',
    message: 'Your order #12345 has been shipped successfully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    isRead: true
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('kajoogram_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [users] = useState<NotificationUser[]>(MOCK_USERS);

  useEffect(() => {
    localStorage.setItem('kajoogram_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const sendNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const getUser = (id: string) => users.find(u => u.id === id);

  return (
    <NotificationContext.Provider value={{ notifications, users, sendNotification, getUser }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationContextProvider');
  }
  return context;
};
