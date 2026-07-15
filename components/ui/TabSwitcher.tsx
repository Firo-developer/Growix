'use client';

import {useLayoutEffect, useRef, useState} from 'react';
import {cn} from '@/lib/utils';

interface TabItem {
  id: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function TabSwitcher({tabs, activeTab, onChange, className}: TabSwitcherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({left: 0, width: 0, ready: false});

  useLayoutEffect(() => {
    const measure = () => {
      const activeEl = tabRefs.current.get(activeTab);
      const containerEl = containerRef.current;
      if (activeEl && containerEl) {
        const containerRect = containerEl.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        setIndicator({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
          ready: true,
        });
      }
    };

    measure();

    // Keep the indicator aligned if the container resizes (e.g. responsive layouts)
    const resizeObserver = new ResizeObserver(measure);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeTab, tabs]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative inline-flex items-center bg-tab-bg rounded-[8px] p-1 gap-0.5',
        className,
      )}>
      <div
        className={cn(
          'absolute top-1 bottom-1 bg-tab-active rounded-[8px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out',
          !indicator.ready && 'opacity-0',
        )}
        style={{left: indicator.left, width: indicator.width}}
      />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => {
            if (el) tabRefs.current.set(tab.id, el);
            else tabRefs.current.delete(tab.id);
          }}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative z-10 flex-1 px-4 py-1.5 rounded-[8px] text-sm font-medium text-center transition-colors duration-300 ease-out cursor-pointer',
            activeTab === tab.id ? 'text-heading' : 'text-muted hover:text-heading',
          )}>
          {tab.label}
        </button>
      ))}
    </div>
  );
}