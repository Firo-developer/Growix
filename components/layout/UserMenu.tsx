'use client';

import {useState} from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {Icon} from '@/components/ui/Icon';
import {cn} from '@/lib/utils';
import {toast} from 'sonner';

const user = {
  name: 'Firaol Lemessa',
  email: 'firoollemessa9@gmail.com',
};

const avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=85';

function MoreIcon() {
  return (
    <span className="flex items-center justify-center gap-[3px]" aria-hidden>
      <span className="h-[3px] w-[3px] rounded-full bg-current" />
      <span className="h-[3px] w-[3px] rounded-full bg-current" />
      <span className="h-[3px] w-[3px] rounded-full bg-current" />
    </span>
  );
}

const menuItems = [
  {
    label: 'Download mobile App',
    icon: 'simcard',
    href: undefined,
    onClick: () => toast.info('Mobile app download will be available soon.'),
  },
  {
    label: 'Settings',
    icon: 'setting',
    href: '/settings',
  },
  {
    label: 'Help & Feedback',
    icon: 'info-circle',
    href: '/help',
  },
  {
    label: 'Log out',
    icon: 'login',
    href: '/login',
    destructive: true,
  },
] as const;

export function UserMenu({collapsed = false}: {collapsed?: boolean}) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {collapsed ? (
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-sm shadow-black/10 ring-1 ring-inset ring-white/10 outline-none transition-all duration-200 hover:scale-[1.03] hover:shadow-md focus-visible:ring-2 focus-visible:ring-heading/30 data-[state=open]:ring-2 data-[state=open]:ring-heading/30"
            aria-label="Open account menu">
            <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
          </button>
        ) : (
          <button
            type="button"
            className={cn(
              'group flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left outline-none transition-colors duration-200',
              'hover:bg-gray/80 data-[state=open]:bg-gray/80 data-[state=open]:[&_.user-menu-more]:opacity-100',
            )}
            aria-label="Open account menu">
            <span className="flex h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-sm shadow-black/5 ring-1 ring-inset ring-black/5">
              <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium leading-tight text-heading">{user.name}</span>
              <span className="mt-0.5 block truncate text-xs leading-tight text-muted">{user.email}</span>
            </span>
            <span
              className={cn(
                'user-menu-more flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition-opacity duration-200',
                'opacity-0 group-hover:opacity-100',
              )}>
              <MoreIcon />
            </span>
          </button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={collapsed ? 'right' : 'top'}
        align={collapsed ? 'end' : 'start'}
        sideOffset={open ? (collapsed ? 8 : 2) : collapsed ? 12 : 8}
        className={cn(
          'z-[250] min-w-[220px] rounded-xl border border-border/70 bg-card p-1.5 shadow-[0_8px_24px_rgba(25,27,31,0.12)]',
          !collapsed && 'w-[calc(var(--radix-dropdown-menu-trigger-width))]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          collapsed
            ? 'data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2'
            : 'data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-in-from-top-1',
          'duration-200',
        )}>
        {menuItems.map((item) => {
          const itemClassName = cn(
            'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150',
            item.destructive ? 'text-heading hover:bg-gray/70' : 'text-heading hover:bg-gray/70',
          );

          if (item.href) {
            return (
              <DropdownMenuItem key={item.label} asChild>
                <Link href={item.href} className={itemClassName}>
                  <Icon name={item.icon} size={17} className="text-muted" />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem key={item.label} className={itemClassName} onClick={item.onClick}>
              <Icon name={item.icon} size={17} className="text-muted" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
