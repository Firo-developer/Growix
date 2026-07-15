'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {Icon} from '@/components/ui/Icon';
import {toast} from 'sonner';

const user = {
  name: 'Firo Dev',
  email: 'firoollemessa9@gmail.com',
  role: 'Business owner',
};

const avatarUrl = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=85';

export function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full shadow-sm shadow-black/10 ring-1 ring-inset ring-white/10 outline-none transition-all duration-200 hover:scale-[1.03] hover:shadow-md focus-visible:ring-2 focus-visible:ring-heading/30 data-[state=open]:ring-2 data-[state=open]:ring-heading/30"
          aria-label="Open account menu">
          <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={12}
        className="z-[250] w-[276px] rounded-[20px] border border-border/70 bg-card/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.16)] backdrop-blur-xl">
        <DropdownMenuLabel className="p-2">
          <div className="flex items-center gap-3">
            <img src={avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-heading">{user.name}</p>
              <p className="mt-0.5 truncate text-xs font-normal text-muted">{user.email}</p>
              <span className="mt-1 inline-flex rounded-md bg-gray px-1.5 py-0.5 text-[10px] font-medium text-text">{user.role}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-heading transition-colors hover:bg-gray/70">
            <Icon name="profile" size={17} className="text-muted" />
            Profile and business details
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-heading transition-colors hover:bg-gray/70">
            <Icon name="setting" size={17} className="text-muted" />
            Workspace settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-heading transition-colors hover:bg-gray/70"
          onClick={() => toast.info('Help and feedback will be available here soon.')}>
          <Icon name="info-circle" size={17} className="text-muted" />
          Help and feedback
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#d94343] transition-colors hover:bg-[#fff0f0] dark:hover:bg-[#3a1518]"
          onClick={() => toast.info('Sign out will be connected to authentication soon.')}>
          <Icon name="arrow-left2" size={17} className="text-current" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
