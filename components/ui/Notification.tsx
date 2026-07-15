'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import {createPortal} from 'react-dom';
import {AnimatePresence, motion} from 'motion/react';
import {Check, Info, X} from 'lucide-react';
import {cn} from '@/lib/utils';

type NotificationVariant = 'error' | 'success' | 'info';

interface NotificationItem {
  id: string;
  message: string;
  variant: NotificationVariant;
}

interface NotificationContextValue {
  notify: (message: string, variant?: NotificationVariant) => void;
  dismiss: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

const variantStyles: Record<
  NotificationVariant,
  {bg: string; icon: ReactNode; iconBg: string}
> = {
  error: {
    bg: 'bg-[#E53935]',
    iconBg: 'bg-white/20',
    icon: <X size={14} strokeWidth={2.5} className="text-white" />,
  },
  success: {
    bg: 'bg-heading',
    iconBg: 'bg-white/15',
    icon: <Check size={14} strokeWidth={2.5} className="text-white" />,
  },
  info: {
    bg: 'bg-[#535557]',
    iconBg: 'bg-white/15',
    icon: <Info size={14} strokeWidth={2.5} className="text-white" />,
  },
};

const AUTO_DISMISS_MS = 4000;

export function NotificationProvider({children}: {children: ReactNode}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, variant: NotificationVariant = 'error') => {
      const id = crypto.randomUUID();
      setNotifications((prev) => [...prev, {id, message, variant}]);
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  return (
    <NotificationContext.Provider value={{notify, dismiss}}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4">
            <AnimatePresence mode="popLayout">
              {notifications.map((item) => {
                const style = variantStyles[item.variant];
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{opacity: 0, y: 24, scale: 0.92}}
                    animate={{opacity: 1, y: 0, scale: 1}}
                    exit={{opacity: 0, y: 12, scale: 0.95}}
                    transition={{duration: 0.35, ease: [0.22, 1, 0.36, 1]}}
                    className={cn(
                      'pointer-events-auto w-full flex items-center gap-3 px-4 py-3 rounded-2xl',
                      'shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
                      style.bg,
                    )}>
                    <span
                      className={cn(
                        'w-7 h-7 rounded-full flex items-center justify-center shrink-0',
                        style.iconBg,
                      )}>
                      {style.icon}
                    </span>
                    <p className="text-sm font-medium text-white flex-1">{item.message}</p>
                    <button
                      type="button"
                      onClick={() => dismiss(item.id)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer shrink-0">
                      <X size={14} strokeWidth={2} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return ctx;
}
