'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import {motion} from 'motion/react';
import {ThemeToggle} from '@/components/layout/ThemeToggle';
import {useSidebar} from '@/components/layout/SidebarContext';
import {Tooltip} from '@/components/ui/Tooltip';
import {CommandPalette} from '@/components/search/CommandPalette';
import {Icon} from '@/components/ui/Icon';

const SCROLL_THRESHOLD = 24;
const ACTION_BUTTON =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray hover:text-heading';
const SMOOTH_TRANSITION = {duration: 0.34, ease: [0.22, 1, 0.36, 1] as const};

function MoreIcon() {
  return (
    <span className="flex items-center justify-center gap-[3px]" aria-hidden>
      <span className="h-[3px] w-[3px] rounded-full bg-current" />
      <span className="h-[3px] w-[3px] rounded-full bg-current" />
      <span className="h-[3px] w-[3px] rounded-full bg-current" />
    </span>
  );
}

function CollapsibleSlot({visible, children}: {visible: boolean; children: React.ReactNode}) {
  return (
    <motion.div
      initial={false}
      animate={{
        width: visible ? 36 : 0,
        opacity: visible ? 1 : 0,
      }}
      transition={SMOOTH_TRANSITION}
      className="overflow-hidden"
      style={{pointerEvents: visible ? 'auto' : 'none'}}>
      {children}
    </motion.div>
  );
}

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const lastScrollY = useRef(0);
  const {setMobileOpen} = useSidebar();
  const pathname = usePathname();
  const isAssistant = pathname === '/assistant';

  const showExpanded = !isCompact || menuExpanded;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const update = () => setShowMobileNav(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY <= SCROLL_THRESHOLD) {
        setIsCompact(false);
        setMenuExpanded(false);
      } else if (delta > 2) {
        setIsCompact(true);
        setMenuExpanded(false);
      } else if (delta < -2) {
        setIsCompact(false);
        setMenuExpanded(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dispatchAssistantEvent = (name: 'assistant:new-chat' | 'assistant:toggle-history') => {
    window.dispatchEvent(new Event(name));
  };

  return (
    <>
      <header className="fixed right-3 top-3 z-30 sm:right-5">
        <motion.div
          layout
          initial={false}
          animate={{
            gap: showExpanded ? 4 : 0,
            paddingRight: showExpanded ? 4 : 0,
            borderRadius: showExpanded ? 26 : 9999,
          }}
          transition={SMOOTH_TRANSITION}
          className="flex items-center overflow-hidden border border-border/75 bg-card/85 py-0.5 shadow-[0_8px_24px_rgba(25,27,31,0.04)] backdrop-blur-sm">
          <CollapsibleSlot visible={showExpanded && showMobileNav}>
            <Tooltip content="Open navigation" side="bottom">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={ACTION_BUTTON}
                aria-label="Open navigation">
                <Icon name="menu" size={18} />
              </button>
            </Tooltip>
          </CollapsibleSlot>

          {isAssistant && (
            <>
              <CollapsibleSlot visible={showExpanded}>
                <Tooltip content="New chat" side="bottom">
                  <button
                    type="button"
                    onClick={() => dispatchAssistantEvent('assistant:new-chat')}
                    className={ACTION_BUTTON}
                    aria-label="Start new chat">
                    <Icon name="new-chat" size={18} />
                  </button>
                </Tooltip>
              </CollapsibleSlot>
              <CollapsibleSlot visible={showExpanded}>
                <Tooltip content="Chat history" side="bottom">
                  <button
                    type="button"
                    onClick={() => dispatchAssistantEvent('assistant:toggle-history')}
                    className={ACTION_BUTTON}
                    aria-label="Open chat history">
                    <Icon name="conversation-box" size={18} />
                  </button>
                </Tooltip>
              </CollapsibleSlot>
            </>
          )}

          <CollapsibleSlot visible={showExpanded}>
            <Tooltip content="Search (Ctrl+K)" side="bottom">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={ACTION_BUTTON}
                aria-label="Search">
                <Icon name="search" size={17} />
              </button>
            </Tooltip>
          </CollapsibleSlot>

          <CollapsibleSlot visible={showExpanded}>
            <ThemeToggle className="text-muted hover:text-heading" />
          </CollapsibleSlot>

          <CollapsibleSlot visible={!showExpanded}>
            <Tooltip content="More actions" side="bottom">
              <button
                type="button"
                onClick={() => setMenuExpanded(true)}
                className={ACTION_BUTTON}
                aria-label="More actions"
                aria-expanded={false}>
                <MoreIcon />
              </button>
            </Tooltip>
          </CollapsibleSlot>
        </motion.div>
      </header>
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
