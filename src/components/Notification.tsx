import React, { useEffect, useState } from 'react';
import { Notification as NotificationType } from '../types';

interface NotificationProps {
  notification: NotificationType | null;
  onDismiss: (id: number) => void;
}

export const Notification: React.FC<NotificationProps> = ({ notification, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        // Allow time for fade out animation before calling dismiss
        setTimeout(() => onDismiss(notification.id), 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);
  
  if (!notification) {
      return null;
  }

  const baseClasses = "fixed top-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-2xl text-white font-bold text-center z-50 transition-all duration-300";
  const visibilityClasses = visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5";
  
  const typeClasses = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    special: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-lg py-4 px-8'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[notification.type]} ${visibilityClasses}`}>
      {notification.message}
    </div>
  );
};
