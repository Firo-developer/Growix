'use client';

import {ThemeProvider} from 'next-themes';
import {Toaster} from 'sonner';
import {NotificationProvider} from '@/components/ui/Notification';

export function Providers({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NotificationProvider>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            classNames: {
              toast:
                'rounded-2xl border border-border/60 bg-card text-heading shadow-[0_8px_30px_rgba(0,0,0,0.12)]',
            },
          }}
        />
      </NotificationProvider>
    </ThemeProvider>
  );
}
