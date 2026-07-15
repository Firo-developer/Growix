'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {cn} from '@/lib/utils';
import {Icon} from '@/components/ui/Icon';

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function displayDate(value: string) {
  if (!value) return 'Choose date';
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('en', {month: 'short', day: 'numeric', year: 'numeric'}).format(date);
}

export function DatePicker({label, value, onChange, className}: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedDate = value ? new Date(`${value}T00:00:00`) : null;
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => selectedDate ?? new Date());

  const days = useMemo(() => {
    const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    return Array.from({length: firstDay + daysInMonth}, (_, index) => index < firstDay ? null : new Date(viewDate.getFullYear(), viewDate.getMonth(), index - firstDay + 1));
  }, [viewDate]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && <label className="mb-2 block text-sm font-medium text-heading">{label}</label>}
      <button type="button" onClick={() => { setViewDate(selectedDate ?? new Date()); setOpen((current) => !current); }} className="flex h-10 w-full items-center justify-between gap-3 rounded-xl border border-border/60 bg-card px-3.5 text-left text-sm text-heading transition-colors hover:border-border focus:outline-none focus:ring-2 focus:ring-heading/5">
        <span className={cn(!value && 'text-muted')}>{displayDate(value)}</span>
        <Icon name="calendar" size={16} className="text-muted" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity: 0, y: -6, scale: 0.98}} animate={{opacity: 1, y: 0, scale: 1}} exit={{opacity: 0, y: -4, scale: 0.98}} transition={{duration: 0.2, ease: [0.22, 1, 0.36, 1]}} className="absolute left-0 z-[120] mt-2 w-[290px] rounded-2xl border border-border/70 bg-card p-3 shadow-[0_16px_36px_rgba(25,27,31,0.12)]">
            <div className="mb-3 flex items-center justify-between">
              <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-gray hover:text-heading" aria-label="Previous month"><Icon name="arrow-left2" size={15} /></button>
              <p className="text-sm font-semibold text-heading">{new Intl.DateTimeFormat('en', {month: 'long', year: 'numeric'}).format(viewDate)}</p>
              <button type="button" onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-gray hover:text-heading" aria-label="Next month"><Icon name="arrow-right2" size={15} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((day) => <span key={day} className="py-1 text-[11px] font-medium text-muted">{day}</span>)}
              {days.map((day, index) => {
                if (!day) return <span key={`empty-${index}`} />;
                const dayValue = toDateValue(day);
                const selected = dayValue === value;
                const today = dayValue === toDateValue(new Date());
                return <button key={dayValue} type="button" onClick={() => { onChange(dayValue); setOpen(false); }} className={cn('mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs transition-colors', selected ? 'bg-heading text-bg' : today ? 'bg-gray text-heading' : 'text-text hover:bg-gray')} aria-label={displayDate(dayValue)}>{day.getDate()}</button>;
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
