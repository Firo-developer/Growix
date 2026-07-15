'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {AnimatePresence, motion} from 'motion/react';
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
  const link = (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      className={cn(
        'flex items-center text-[14px] font-medium transition-colors',
        collapsed ? 'h-9 w-9 justify-center rounded-full' : 'h-10 w-full gap-1.5 rounded-xl pl-[12px] pr-2',
        isActive ? (collapsed ? 'bg-gray text-heading' : 'bg-gray text-heading') : 'text-text hover:bg-gray/70 hover:text-heading',
      )}>
      <Icon name={item.iconName} size={18} className={cn('shrink-0', isActive ? 'text-heading' : 'text-muted')} />
      <span className={cn('min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,transform] duration-200 ease-out', collapsed ? 'max-w-0 translate-x-1 opacity-0' : 'max-w-[180px] translate-x-0 opacity-100')}>
        {item.label}
      </span>
    </Link>
  );

  return link;
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
      <div className={cn('flex h-14 shrink-0 items-center', collapsed ? 'justify-start px-[11px]' : 'justify-between px-[11px]')}>
        {collapsed ? (
          <button
            type="button"
            onClick={onToggle}
            aria-label={toggleLabel}
            title="Expand sidebar"
            className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-border/75 bg-card text-heading shadow-[0_4px_10px_rgba(25,27,31,0.04)] transition-colors hover:bg-gray">
            <img src="/logo.png" alt="EthioGrowth" className="h-8 w-8 transition-opacity duration-150 group-hover:opacity-0" />
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
              aria-label="EthioGrowth dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-heading transition-colors hover:bg-gray">
              <img src="/logo.png" alt="EthioGrowth" className="h-8 w-8" />
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

      <nav className={cn('flex-1 overflow-y-auto no-scrollbar', collapsed ? 'px-0 py-3' : 'px-2 py-2')}>
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
      </nav>

      <div className={cn('py-3', collapsed ? 'px-0' : 'px-2')}>
        <div className={cn('flex items-center', collapsed ? 'mx-auto w-fit flex-col-reverse gap-1 rounded-[22px] border border-border/75 bg-card p-1 shadow-[0_8px_22px_rgba(25,27,31,0.06)]' : 'justify-between')}>
          <div className={cn('flex h-9 w-9 items-center justify-center', !collapsed && 'ml-[3px]')}>
            <UserMenu />
          </div>
          {settingsLink}
        </div>
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
            'flex h-full flex-col',
            collapsed ? 'border-r-0 bg-transparent' : 'border-r border-border/60 bg-[#FDFDFD] dark:bg-sidebar',
          )}>
          <SidebarInner
            collapsed={collapsed}
            onNavigate={() => {}}
            onToggle={toggleCollapsed}
            toggleLabel={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          />
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
