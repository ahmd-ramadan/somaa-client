import { useEffect, useState } from 'react';

interface UsePreventRefreshOptions {
  enabled?: boolean;
  message?: string;
  onRefreshAttempt?: () => void;
}

export function usePreventRefresh(options: UsePreventRefreshOptions = {}) {
  const { 
    enabled = true, 
    message = 'You have unsaved changes. Are you sure you want to leave?',
    onRefreshAttempt 
  } = options;

  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent F5 and Ctrl+R refresh
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault();
        if (onRefreshAttempt) {
          onRefreshAttempt();
        } else {
          setShowWarning(true);
        }
      }
    };

    // Prevent right-click context menu (optional)
    const handleContextMenu = (e: MouseEvent) => {
      // You can optionally prevent right-click refresh
      // e.preventDefault();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [enabled, message, onRefreshAttempt]);

  const dismissWarning = () => setShowWarning(false);

  return {
    showWarning,
    dismissWarning
  };
} 