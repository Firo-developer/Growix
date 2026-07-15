'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {AnimatePresence, motion} from 'motion/react';
import {Icon} from '@/components/ui/Icon';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface SearchItem {
  label: string;
  detail: string;
  icon: Parameters<typeof Icon>[0]['name'];
  href: string;
}

const searchItems: SearchItem[] = [
  {label: 'Dashboard', detail: 'Business overview', icon: 'grid-equal', href: '/dashboard'},
  {label: 'AI Assistant', detail: 'Ask EthioGrowth AI', icon: 'conversation-box', href: '/assistant'},
  {label: 'Marketing', detail: 'Campaigns and ideas', icon: 'status-up', href: '/marketing'},
  {label: 'Business Plan', detail: 'Plan your next steps', icon: 'subtitle', href: '/plan'},
  {label: 'Branding', detail: 'Build a clearer identity', icon: 'ai-homepage', href: '/branding'},
  {label: 'Targeting', detail: 'Understand your customers', icon: 'gps', href: '/targeting'},
  {label: 'Settings', detail: 'Workspace preferences', icon: 'setting', href: '/settings'},
];

export function CommandPalette({open, onClose}: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const normalizedQuery = query.trim().toLowerCase();
  const results = useMemo(() => searchItems.filter((item) => `${item.label} ${item.detail}`.toLowerCase().includes(normalizedQuery)), [normalizedQuery]);
  const showResults = normalizedQuery.length > 0;

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setActiveIndex(0);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [normalizedQuery]);

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
        const result = results[activeIndex];
        if (result) {
          onClose();
          router.push(result.href);
        }
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeIndex, onClose, open, results, router, showResults]);

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
          <div className="flex h-12 items-center gap-3 px-4">
            <Icon name="search" size={18} className="text-muted" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your workspace"
              className="h-full min-w-0 flex-1 bg-transparent text-sm text-heading outline-none placeholder:text-muted"
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
                <div className="p-2">
                  {results.length > 0 ? results.map((item, index) => (
                    <motion.div key={item.href} initial={{opacity: 0, y: 5}} animate={{opacity: 1, y: 0}} transition={{duration: 0.18, delay: index * 0.025}}>
                      <Link href={item.href} onClick={onClose} onMouseEnter={() => setActiveIndex(index)} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${activeIndex === index ? 'bg-gray text-heading' : 'text-heading hover:bg-gray/70'}`}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray/80 text-muted"><Icon name={item.icon} size={16} /></span>
                        <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{item.label}</span><span className="mt-0.5 block truncate text-xs text-muted">{item.detail}</span></span>
                        <Icon name="arrow-right4" size={14} className="text-muted" />
                      </Link>
                    </motion.div>
                  )) : (
                    <motion.p initial={{opacity: 0, y: 4}} animate={{opacity: 1, y: 0}} className="px-3 py-5 text-center text-sm text-muted">No matching pages</motion.p>
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
