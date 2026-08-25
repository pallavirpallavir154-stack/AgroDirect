import React, { createContext, useContext, useState, useEffect } from 'react';

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
  queueOfflineDraft: (key: string, data: any) => void;
  getOfflineDraft: (key: string) => any;
  syncOfflineQueue: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial pending sync calculation
    const queue = JSON.parse(localStorage.getItem('agrodirect_offline_sync_queue') || '[]');
    setPendingSyncCount(queue.length);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const queueOfflineDraft = (key: string, data: any) => {
    localStorage.setItem(`draft_${key}`, JSON.stringify(data));
    const queue = JSON.parse(localStorage.getItem('agrodirect_offline_sync_queue') || '[]');
    if (!queue.includes(key)) {
      queue.push(key);
      localStorage.setItem('agrodirect_offline_sync_queue', JSON.stringify(queue));
      setPendingSyncCount(queue.length);
    }
  };

  const getOfflineDraft = (key: string) => {
    const raw = localStorage.getItem(`draft_${key}`);
    return raw ? JSON.parse(raw) : null;
  };

  const syncOfflineQueue = async () => {
    if (!navigator.onLine) return;
    setIsSyncing(true);
    try {
      const queue = JSON.parse(localStorage.getItem('agrodirect_offline_sync_queue') || '[]');
      // Process sync queue
      for (const itemKey of queue) {
        // Clear synced items
        localStorage.removeItem(`draft_${itemKey}`);
      }
      localStorage.setItem('agrodirect_offline_sync_queue', JSON.stringify([]));
      setPendingSyncCount(0);
    } catch (e) {
      console.error('Offline sync failed', e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingSyncCount,
        queueOfflineDraft,
        getOfflineDraft,
        syncOfflineQueue,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) throw new Error('useOffline must be used within an OfflineProvider');
  return context;
};
