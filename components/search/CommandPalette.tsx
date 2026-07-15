'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {AnimatePresence, motion} from 'motion/react';
import {Icon} from '@/components/ui/Icon';
import {
  queueAssistantConversationRestore,
  readAssistantConversations,
  searchAssistantConversations,
  type StoredConversation,
} from '@/lib/assistant-conversations';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface PageSearchItem {
  type: 'page';
  label: string;
  detail: string;
  icon: Parameters<typeof Icon>[0]['name'];
  href: string;
}

interface ChatSearchItem {
  type: 'chat';
  id: number;
  label: string;
  detail: string;
}

type SearchResult = PageSearchItem | ChatSearchItem;

const pageItems: Omit<PageSearchItem, 'type'>[] = [
  {label: 'Dashboard', detail: 'Business overview', icon: 'grid-equal', href: '/dashboard'},
  {label: 'AI Assistant', detail: 'Ask EthioGrowth AI', icon: 'conversation-box', href: '/assistant'},
  {label: 'Marketing', detail: 'Campaigns and ideas', icon: 'status-up', href: '/marketing'},
  {label: 'Business Plan', detail: 'Plan your next steps', icon: 'subtitle', href: '/plan'},
  {label: 'Branding', detail: 'Build a clearer identity', icon: 'ai-homepage', href: '/branding'},
  {label: 'Targeting', detail: 'Understand your customers', icon: 'gps', href: '/targeting'},
  {label: 'Settings', detail: 'Workspace preferences', icon: 'setting', href: '/settings'},
];

function toChatItem(conversation: StoredConversation): ChatSearchItem {
  return {
    type: 'chat',
    id: conversation.id,
    label: conversation.title,
    detail: conversation.preview,
  };
}

function getChatSearchQuery(query: string) {
  return query.trim().replace(/^@chat\s*/i, '');
}

export function CommandPalette({open, onClose}: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const normalizedQuery = query.trim().toLowerCase();
  const hasQuery = query.length > 0;
  const isChatMode = normalizedQuery.startsWith('@chat');
  const chatSearchQuery = isChatMode ? getChatSearchQuery(query) : '';

  const results = useMemo(() => {
    if (isChatMode) {
      return searchAssistantConversations(chatSearchQuery, conversations).map(toChatItem);
    }
    return pageItems
      .filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(normalizedQuery))
      .map((item) => ({type: 'page' as const, ...item}));
  }, [chatSearchQuery, conversations, isChatMode, normalizedQuery]);

  const showResults = normalizedQuery.length > 0;

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    setConversations(readAssistantConversations());
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedQuery]);

  function selectResult(result: SearchResult) {
    onClose();
    if (result.type === 'chat') {
      queueAssistantConversationRestore(result.id);
      router.push('/assistant');
      return;
    }
    router.push(result.href);
  }

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) onClose();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (!showResults || results.length === 0) return;
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % results.length);
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + results.length) % results.length);
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        const result = results[activeIndex];
        if (result) selectResult(result);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onClose, open, results, showResults]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          initial={{opacity: 0, y: -8, scale: 0.98}}
          animate={{opacity: 1, y: 0, scale: 1}}
          exit={{opacity: 0, y: -8, scale: 0.98}}
          transition={{type: 'spring', stiffness: 430, damping: 32}}
          className="fixed left-1/2 top-3 z-[100] w-[calc(100vw-2rem)] max-w-[560px] -translate-x-1/2 overflow-hidden rounded-[22px] border border-border/80 bg-card/95 shadow-[0_18px_45px_rgba(25,27,31,0.12)] backdrop-blur-xl">
          <div className={`flex items-center gap-3 px-4 transition-all duration-200 ${hasQuery ? 'h-[52px]' : 'h-12'}`}>
            <Icon name="search" size={hasQuery ? 20 : 18} className="shrink-0 text-muted transition-all duration-200" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages or type @chat"
              style={{fontSize: hasQuery ? '18px' : '14px', lineHeight: hasQuery ? '26px' : '20px'}}
              className="h-full min-w-0 flex-1 bg-transparent font-medium text-heading outline-none transition-all duration-200 placeholder:font-normal placeholder:text-muted"
              aria-label="Search workspace"
            />
            <button type="button" onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition-colors hover:bg-gray hover:text-heading" aria-label="Close search">
              <Icon name="x" size={15} />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showResults && (
              <motion.div
                initial={{height: 0, opacity: 0}}
                animate={{height: 'auto', opacity: 1}}
                exit={{height: 0, opacity: 0}}
                transition={{duration: 0.22, ease: [0.22, 1, 0.36, 1]}}
                className="overflow-hidden border-t border-border/70">
                <div className="p-1.5">
                  {isChatMode && (
                    <p className="px-2.5 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted">Chat history</p>
                  )}
                  {results.length > 0 ? results.map((item, index) => (
                    <motion.div key={item.type === 'chat' ? `chat-${item.id}` : item.href} initial={{opacity: 0, y: 2}} animate={{opacity: 1, y: 0}} transition={{duration: 0.12, delay: index * 0.015}}>
                      {item.type === 'page' ? (
                        <Link href={item.href} onClick={onClose} onMouseEnter={() => setActiveIndex(index)} className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors ${activeIndex === index ? 'bg-gray text-heading' : 'text-heading hover:bg-gray/70'}`}>
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray/80 text-muted"><Icon name={item.icon} size={14} /></span>
                          <span className="min-w-0 flex-1"><span className="block text-[13px] font-medium leading-tight">{item.label}</span><span className="mt-0.5 block truncate text-[11px] leading-4 text-muted">{item.detail}</span></span>
                          <Icon name="arrow-right4" size={12} className="shrink-0 text-muted" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => selectResult(item)}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors ${activeIndex === index ? 'bg-gray text-heading' : 'text-heading hover:bg-gray/70'}`}>
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray/80 text-muted"><Icon name="conversation-box" size={14} /></span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-medium leading-tight">{item.label}</span><span className="mt-0.5 block truncate text-[11px] leading-4 text-muted">{item.detail}</span></span>
                          <span className="shrink-0 rounded-md bg-gray/80 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-muted">Chat</span>
                        </button>
                      )}
                    </motion.div>
                  )) : (
                    <motion.p initial={{opacity: 0, y: 2}} animate={{opacity: 1, y: 0}} transition={{duration: 0.12}} className="px-3 py-4 text-center text-xs text-muted">
                      {isChatMode ? 'No matching chats' : 'No matching pages'}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
