import { useEffect } from 'react';
import '../styles/alert.component.css';


type AlertProps = {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
};

export default function Alert({ 
  message, 
  type = 'error', 
  duration = 3000, 
  onClose 
}: AlertProps) {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);


  return (
    <div className={'alert_container'}>
      <div className={`alert alert_${type}`}  role="alert">
        <span className="alert-message">{message}</span>
        {onClose && (
          <span className="alert-close" onClick={onClose}>
            <svg className="alert-close-icon" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}