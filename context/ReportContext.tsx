
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Report } from '../types';

interface ReportContextType {
  reports: Report[];
  updateReportStatus: (id: string, status: 'reviewed' | 'resolved') => void;
  getReport: (id: string) => Report | undefined;
}

// Initial Mock Data to simulate existing database records
const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-1',
    userId: 'u-101',
    username: 'Sophia Styles',
    userAvatar: 'https://picsum.photos/id/64/200/200',
    subject: 'Inappropriate Content in Discover',
    description: 'I found a video in the discover section that violates community guidelines. It contains offensive language.',
    images: ['https://picsum.photos/id/10/400/600'],
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() // 2 hours ago
  },
  {
    id: 'rep-2',
    userId: 'u-102',
    username: 'Rahul Gamer',
    userAvatar: 'https://picsum.photos/id/65/200/200',
    subject: 'Bug in Payment Gateway',
    description: 'I tried to purchase the Leather Jacket but the payment page kept loading indefinitely. Please fix this urgent issue.',
    images: ['https://picsum.photos/id/20/400/600', 'https://picsum.photos/id/21/400/600'],
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 1 day ago
  },
  {
    id: 'rep-3',
    userId: 'u-103',
    username: 'LuxuryLover',
    userAvatar: 'https://picsum.photos/id/66/200/200',
    subject: 'Request for new Brand',
    description: 'Can you please add Balenciaga to the supported platforms? I really love their new collection.',
    images: [],
    status: 'reviewed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() // 2 days ago
  }
];

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(() => {
    const saved = localStorage.getItem('kajoogram_reports');
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  useEffect(() => {
    localStorage.setItem('kajoogram_reports', JSON.stringify(reports));
  }, [reports]);

  const updateReportStatus = (id: string, status: 'reviewed' | 'resolved') => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const getReport = (id: string) => reports.find(r => r.id === id);

  return (
    <ReportContext.Provider value={{ reports, updateReportStatus, getReport }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReportContext must be used within a ReportContextProvider');
  }
  return context;
};
