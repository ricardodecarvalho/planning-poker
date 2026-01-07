import { useState, useEffect } from 'react';

export type ViewType = 'table' | 'list';

const STORAGE_KEY = 'poker-room-view-preference';

export const useViewPreference = () => {
  const [viewType, setViewType] = useState<ViewType>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return (stored as ViewType) || 'table';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, viewType);
  }, [viewType]);

  const toggleView = () => {
    setViewType((prev) => (prev === 'table' ? 'list' : 'table'));
  };

  return { viewType, setViewType, toggleView };
};
