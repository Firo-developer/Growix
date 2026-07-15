'use client';

import {useTheme} from 'next-themes';
import {useEffect, useState} from 'react';
import {AnimatePresence, motion} from 'motion/react';
import {cn} from '@/lib/utils';
import {Tooltip} from '@/components/ui/Tooltip';
import {Icon} from '@/components/ui/Icon';

export function ThemeToggle({className}: {className?: string}) {
  const {setTheme, resolvedTheme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return <div className={cn('w-9 h-9', className)} />;
  }

  const handleToggle = () => {
    document.documentElement.classList.add('theme-transitioning');
    setTheme(isDark ? 'light' : 'dark');
    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 450);
  };

  return (
    <Tooltip content={isDark ? 'Light mode' : 'Dark mode'} side="bottom">
      <button
        type="button"
        onClick={handleToggle}
        className={cn(
          'relative w-9 h-9 flex items-center justify-center rounded-full',
          'hover:bg-gray/60 dark:hover:bg-white/10 transition-colors duration-300 cursor-pointer active:scale-95',
          className,
        )}
        aria-label="Toggle theme">
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={isDark ? 'sun' : 'moon'}
            initial={{opacity: 0, rotate: -60, scale: 0.7}}
            animate={{opacity: 1, rotate: 0, scale: 1}}
            exit={{opacity: 0, rotate: 60, scale: 0.7}}
            transition={{duration: 0.2, ease: [0.22, 1, 0.36, 1]}}
            className="flex h-5 w-5 items-center justify-center">
            <Icon name={isDark ? 'sun' : 'moon'} size={18} />
          </motion.span>
        </AnimatePresence>
      </button>
    </Tooltip>
  );
}
