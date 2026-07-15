'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {ChevronRight, Home} from 'lucide-react';
import {cn} from '@/lib/utils';

const routeLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  events: 'Events',
  calendars: 'Calendars',
  discover: 'Discover',
  settings: 'Settings',
  profile: 'Profile',
};

export function Breadcrumbs({className}: {className?: string}) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  const crumbs = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = routeLabels[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    const isLast = index === segments.length - 1;
    return {href, label, isLast};
  });

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 min-w-0', className)}>
      <Link
        href="/dashboard"
        className="p-1 rounded-md text-muted hover:text-heading transition-colors shrink-0">
        <Home size={14} />
      </Link>
      {crumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center gap-1 min-w-0">
          <ChevronRight size={12} className="text-muted/50 shrink-0" />
          {crumb.isLast ? (
            <span className="text-[13px] font-medium text-heading truncate">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-[13px] text-muted hover:text-heading transition-colors truncate">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
