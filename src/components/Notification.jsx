import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [onClose, duration]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-500/10 border border-green-500/20 text-green-400',
          icon: <CheckCircle size={20} className="text-green-400" />,
        };
      case 'error':
        return {
          container: 'bg-red-500/10 border border-red-500/20 text-red-400',
          icon: <XCircle size={20} className="text-red-400" />,
        };
      case 'warning':
        return {
          container: 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400',
          icon: <XCircle size={20} className="text-yellow-400" />,
        };
      default:
        return {
          container: 'bg-blue-500/10 border border-blue-500/20 text-blue-400',
          icon: <CheckCircle size={20} className="text-blue-400" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-md ${styles.container} animate-in slide-in-from-right-2`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex text-current hover:opacity-75 transition-opacity"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
