'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {Check, ChevronDown} from 'lucide-react';
import {cn} from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open && listRef.current) {
      const selectedEl = listRef.current.querySelector('[data-selected="true"]');
      selectedEl?.scrollIntoView({block: 'nearest'});
    }
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-heading mb-2">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'w-full h-11 px-4 flex items-center justify-between gap-3',
          'bg-gray rounded-xl text-sm text-heading text-left',
          'outline-none transition-all duration-300 ease-out cursor-pointer',
          'hover:bg-[#E5E5E5]',
          open && 'ring-2 ring-heading/10 bg-[#E5E5E5]',
        )}>
        <span className={cn(!selected && 'text-muted')}>
          {selected?.label ?? placeholder}
        </span>
        <motion.span
          animate={{rotate: open ? 180 : 0}}
          transition={{duration: 0.25, ease: 'easeOut'}}
          className="shrink-0 text-muted">
          <ChevronDown size={16} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{opacity: 0, y: -6, scale: 0.98}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, y: -4, scale: 0.98}}
            transition={{duration: 0.2, ease: [0.22, 1, 0.36, 1]}}
            className={cn(
              'absolute z-50 left-0 right-0 mt-2',
              'bg-card rounded-2xl border border-border/60',
              'shadow-[0_8px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]',
              'overflow-hidden',
            )}>
            <div
              ref={listRef}
              role="listbox"
              className="max-h-[280px] overflow-y-auto py-1.5 px-1.5 select-scrollbar">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl',
                      'text-sm text-heading text-left cursor-pointer',
                      'transition-colors duration-200 ease-out',
                      isSelected ? 'bg-gray/80' : 'hover:bg-gray/60',
                    )}>
                    <span>{option.label}</span>
                    {isSelected && (
                      <motion.span
                        initial={{opacity: 0, scale: 0.6}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{duration: 0.15}}>
                        <Check size={14} strokeWidth={2.5} className="text-heading shrink-0" />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
