'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {ThemeToggle} from '@/components/layout/ThemeToggle';
import {useSidebar} from '@/components/layout/SidebarContext';
import {Tooltip} from '@/components/ui/Tooltip';
import {CommandPalette} from '@/components/search/CommandPalette';
import {Icon} from '@/components/ui/Icon';

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const {setMobileOpen} = useSidebar();
  const pathname = usePathname();
  const isAssistant = pathname === '/assistant';

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') { event.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const dispatchAssistantEvent = (name: 'assistant:new-chat' | 'assistant:toggle-history') => {
    window.dispatchEvent(new Event(name));
  };

  return <><header className="fixed right-3 top-3 z-30 sm:right-5"><div className="flex items-center gap-1 rounded-[26px] border border-border/75 bg-card/85 py-0.5 pr-1 shadow-[0_8px_24px_rgba(25,27,31,0.04)]"><Tooltip content="Open navigation" side="bottom"><button type="button" onClick={() => setMobileOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray hover:text-heading lg:hidden" aria-label="Open navigation"><Icon name="menu" size={18} /></button></Tooltip>{isAssistant && <><Tooltip content="New chat" side="bottom"><button type="button" onClick={() => dispatchAssistantEvent('assistant:new-chat')} className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="Start new chat"><Icon name="new-chat" size={18} /></button></Tooltip><Tooltip content="Chat history" side="bottom"><button type="button" onClick={() => dispatchAssistantEvent('assistant:toggle-history')} className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="Open chat history"><Icon name="conversation-box" size={18} /></button></Tooltip></>}<Tooltip content="Search (Ctrl+K)" side="bottom"><button type="button" onClick={() => setSearchOpen(true)} className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="Search"><Icon name="search" size={17} /></button></Tooltip><ThemeToggle className="text-muted hover:text-heading" /></div></header><CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} /></>;
}
