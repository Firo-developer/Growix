'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import {cn} from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

function TabsList({className, ...props}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex items-center bg-tab-bg rounded-xl p-1 gap-0.5',
        className,
      )}
      {...props}
    />
  );
}

function TabsTrigger({className, ...props}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5',
        'text-sm font-medium text-muted transition-all duration-300',
        'data-[state=active]:bg-tab-active data-[state=active]:text-heading data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.08)]',
        'hover:text-heading cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({className, ...props}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('mt-4 focus-visible:outline-none', className)}
      {...props}
    />
  );
}

export {Tabs, TabsList, TabsTrigger, TabsContent};
