'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {AnimatePresence, LayoutGroup, motion} from 'motion/react';
import {cn} from '@/lib/utils';
import {useSidebar} from '@/components/layout/SidebarContext';
import {Icon} from '@/components/ui/Icon';
import {UserMenu} from '@/components/layout/UserMenu';

interface NavItem {
  href: string;
  label: string;
  iconName: string;
}

const navItems: NavItem[] = [
  {href: '/dashboard', label: 'Dashboard', iconName: 'grid-equal'},
  {href: '/assistant', label: 'Assistant', iconName: 'conversation-box'},
  {href: '/marketing', label: 'Marketing', iconName: 'status-up'},
  {href: '/plan', label: 'Business Plan', iconName: 'subtitle'},
  {href: '/branding', label: 'Branding', iconName: 'ai-homepage'},
  {href: '/targeting', label: 'Targeting', iconName: 'gps'},
  {href: '/ads', label: 'Advertising', iconName: 'microphone'},
  {href: '/content', label: 'Content', iconName: 'global'},
];

function NavLink({
  item,
  isActive,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        'relative flex items-center text-[14px] font-medium transition-colors',
        collapsed ? 'h-9 w-9 justify-center rounded-full' : 'h-10 w-full gap-1.5 rounded-xl pl-[12px] pr-2',
        isActive ? 'text-heading' : 'text-text hover:bg-gray/70 hover:text-heading',
      )}>
      {isActive && (
        <motion.span
          layoutId={collapsed ? 'sidebar-nav-active-collapsed' : 'sidebar-nav-active-expanded'}
          className={cn('absolute inset-0 bg-gray', collapsed ? 'rounded-full' : 'rounded-xl')}
          transition={{type: 'spring', stiffness: 400, damping: 32}}
        />
      )}
      <Icon name={item.iconName} size={18} className={cn('relative z-10 shrink-0', isActive ? 'text-heading' : 'text-muted')} />
      {!collapsed && (
        <span className="relative z-10 min-w-0 max-w-[180px] overflow-hidden whitespace-nowrap opacity-100 transition-[max-width,opacity,transform] duration-200 ease-out">
          {item.label}
        </span>
      )}
    </Link>
  );
}

function SidebarInner({
  collapsed,
  onNavigate,
  onToggle,
  toggleLabel,
}: {
  collapsed: boolean;
  onNavigate: () => void;
  onToggle: () => void;
  toggleLabel: string;
}) {
  const pathname = usePathname();
  const settingsLink = (
    <Link
      href="/settings"
      onClick={onNavigate}
      title="Settings"
      className={cn(
        'flex h-9 w-9 items-center justify-center text-muted transition-colors hover:bg-gray hover:text-heading',
        collapsed ? 'rounded-full' : 'rounded-xl',
        pathname.startsWith('/settings') && 'bg-gray text-heading',
      )}>
      <Icon name="setting" size={18} />
    </Link>
  );

  return (
    <>
      <div className={cn('flex h-14 shrink-0 items-center', collapsed ? 'justify-center' : 'justify-between px-[11px]')}>
        {collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={toggleLabel}
            title="Expand sidebar"
            className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-border/75 bg-card text-heading shadow-[0_4px_10px_rgba(25,27,31,0.04)] transition-colors hover:bg-gray">
            <img src="/logo.png" alt="Growix" className="h-8 w-8 transition-opacity duration-150 group-hover:opacity-0" />
            <Icon
              name="sidebar-right"
              size={18}
              className="absolute opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            />
          </button>
        ) : (
          <>
            <Link
              href="/dashboard"
              onClick={onNavigate}
              aria-label="Growix dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-heading transition-colors hover:bg-gray">
              <img src="/logo.png" alt="Growix" className="h-8 w-8" />
            </Link>
            <button
              type="button"
              onClick={onToggle}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-gray hover:text-heading"
              aria-label={toggleLabel}>
              <Icon name="sidebar-left" size={18} />
            </button>
          </>
        )}
      </div>

      <nav className={cn('overflow-y-auto no-scrollbar', collapsed ? 'shrink-0 py-3' : 'flex-1 px-2 py-2')}>
        <LayoutGroup id={collapsed ? 'sidebar-nav-collapsed' : 'sidebar-nav-expanded'}>
          <div className={cn('flex flex-col', collapsed ? 'mx-auto w-fit items-center gap-1 rounded-[22px] border border-border/75 bg-card p-1 shadow-[0_8px_22px_rgba(25,27,31,0.06)]' : 'gap-1')}>
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </LayoutGroup>
      </nav>

      <div className={cn('shrink-0 py-3', collapsed && 'mt-auto', !collapsed && 'px-2')}>
        {collapsed ? (
          <div className="mx-auto flex w-fit flex-col-reverse items-center gap-1 rounded-[22px] border border-border/75 bg-card p-1 shadow-[0_8px_22px_rgba(25,27,31,0.06)]">
            <div className="flex h-9 w-9 items-center justify-center">
              <UserMenu collapsed />
            </div>
            {settingsLink}
          </div>
        ) : (
          <UserMenu collapsed={false} />
        )}
      </div>
    </>
  );
}

export function Sidebar() {
  const {collapsed, mobileOpen, toggleCollapsed, setMobileOpen} = useSidebar();

  return (
    <>
      <div className="fixed left-0 top-0 z-[120] hidden h-screen lg:block">
        <motion.aside
          initial={false}
          animate={{width: collapsed ? 58 : 260}}
          transition={{type: 'spring', stiffness: 360, damping: 34, mass: 0.7}}
          className={cn(
            'flex h-full flex-col overflow-hidden',
            collapsed ? 'border-r-0 bg-transparent' : 'border-r border-border/60 bg-[#FDFDFD] dark:bg-sidebar',
          )}>
          <div className={cn('flex h-full w-full flex-col', collapsed && 'w-[58px] shrink-0')}>
            <SidebarInner
              collapsed={collapsed}
              onNavigate={() => {}}
              onToggle={toggleCollapsed}
              toggleLabel={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            />
          </div>
        </motion.aside>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.2}}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{x: -280}}
              animate={{x: 0}}
              exit={{x: -280}}
              transition={{duration: 0.24, ease: 'easeOut'}}
              className="fixed left-0 top-0 z-50 h-screen w-[280px]">
              <aside className="flex h-full flex-col border-r border-border/60 bg-[#FDFDFD] dark:bg-sidebar">
                <SidebarInner
                  collapsed={false}
                  onNavigate={() => setMobileOpen(false)}
                  onToggle={() => setMobileOpen(false)}
                  toggleLabel="Close navigation"
                />
              </aside>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
