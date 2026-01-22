
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { MOCK_ALL_USERS } from '../data';

interface FriendContextType {
  friends: User[];
  requests: User[];
  suggestions: User[];
  getUserById: (id: string) => User | undefined;
  sendRequest: (userId: string) => void;
  acceptRequest: (userId: string) => void;
  deleteRequest: (userId: string) => void;
  removeFriend: (userId: string) => void;
}

const FriendContext = createContext<FriendContextType | undefined>(undefined);

export const FriendContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize State with Mock Data
  // Friends: Users 0-2 (Ananya, Rahul, Simran)
  const [friendsIds, setFriendsIds] = useState<string[]>(['u-1', 'u-2', 'u-3']);
  
  // Incoming Requests: Users 3-4 (Aditya, Priya)
  const [requestsIds, setRequestsIds] = useState<string[]>(['u-4', 'u-5']);
  
  // Pending Sent Requests: User 5 (Kabir)
  const [sentRequestsIds, setSentRequestsIds] = useState<string[]>(['u-6']);

  // All other users are suggestions

  const getUserById = (id: string): User | undefined => {
    const user = MOCK_ALL_USERS.find(u => u.id === id);
    if (!user) return undefined;
    
    // Determine status relative to logged-in user
    let status: User['friendStatus'] = 'none';
    if (friendsIds.includes(id)) status = 'friend';
    else if (requestsIds.includes(id)) status = 'request_received';
    else if (sentRequestsIds.includes(id)) status = 'request_sent';

    return { ...user, friendStatus: status };
  };

  const sendRequest = (userId: string) => {
    if (!sentRequestsIds.includes(userId)) {
      setSentRequestsIds(prev => [...prev, userId]);
    }
  };

  const acceptRequest = (userId: string) => {
    setRequestsIds(prev => prev.filter(id => id !== userId));
    setFriendsIds(prev => [...prev, userId]);
  };

  const deleteRequest = (userId: string) => {
    setRequestsIds(prev => prev.filter(id => id !== userId));
  };

  const removeFriend = (userId: string) => {
    setFriendsIds(prev => prev.filter(id => id !== userId));
  };

  // Derive Lists
  const friends = friendsIds.map(id => getUserById(id)).filter(u => u !== undefined) as User[];
  const requests = requestsIds.map(id => getUserById(id)).filter(u => u !== undefined) as User[];
  
  const suggestions = MOCK_ALL_USERS
    .filter(u => !friendsIds.includes(u.id!) && !requestsIds.includes(u.id!) && !sentRequestsIds.includes(u.id!))
    .map(u => ({ ...u, friendStatus: 'none' as const }));

  return (
    <FriendContext.Provider value={{ 
      friends, 
      requests, 
      suggestions, 
      getUserById, 
      sendRequest, 
      acceptRequest, 
      deleteRequest, 
      removeFriend 
    }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriendContext = () => {
  const context = useContext(FriendContext);
  if (context === undefined) {
    throw new Error('useFriendContext must be used within a FriendContextProvider');
  }
  return context;
};
