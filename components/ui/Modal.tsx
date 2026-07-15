'use client';

import {useEffect, type ReactNode} from 'react';
import {createPortal} from 'react-dom';
import {AnimatePresence, motion} from 'motion/react';
import {ChevronLeft, X} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/Button';
import {Tooltip} from '@/components/ui/Tooltip';

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  primaryLabel?: string;
  onPrimary?: () => void;
  primaryLoading?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
  hideFooter?: boolean;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  primaryLabel = 'Continue',
  onPrimary,
  primaryLoading = false,
  showBack = false,
  onBack,
  className,
  hideFooter = false,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onOpenChange]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label="Close overlay"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.25}}
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] cursor-default"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{opacity: 0, scale: 0.95, y: 16}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.97, y: 8}}
            transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
            className={cn(
              'relative w-full max-w-[420px] bg-card rounded-[24px]',
              'shadow-[0_24px_48px_rgba(0,0,0,0.12),0_8px_16px_rgba(0,0,0,0.06)]',
              'p-6 sm:p-7',
              className,
            )}>
            <div className="relative flex items-center justify-between gap-3 mb-5 min-h-10">
              <div className="w-8 shrink-0">
                {showBack ? (
                  <Tooltip content="Back" side="bottom">
                    <button
                      type="button"
                      onClick={onBack}
                      className="w-8 h-8 rounded-full bg-gray flex items-center justify-center text-muted hover:bg-[#E0E0E0] transition-colors duration-200 cursor-pointer">
                      <ChevronLeft size={18} strokeWidth={2} />
                    </button>
                  </Tooltip>
                ) : icon ? (
                  <div className="w-10 h-10 rounded-full border border-border/80 flex items-center justify-center">
                    {icon}
                  </div>
                ) : null}
              </div>

              <h2
                id="modal-title"
                className={cn(
                  'text-lg font-semibold text-heading tracking-tight text-center',
                  showBack ? 'absolute left-1/2 -translate-x-1/2' : 'flex-1',
                )}>
                {title}
              </h2>

              <Tooltip content="Close" side="bottom">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="w-8 h-8 rounded-full bg-gray flex items-center justify-center text-muted hover:bg-[#E0E0E0] hover:text-heading transition-colors duration-200 cursor-pointer shrink-0">
                  <X size={16} strokeWidth={2.5} />
                </button>
              </Tooltip>
            </div>

            {description && (
              <p className="text-sm text-muted leading-relaxed mb-5">{description}</p>
            )}

            {children}

            {!hideFooter && (
              <div className={cn(children || description ? 'mt-6' : '')}>
                <Button
                  variant="dark"
                  size="lg"
                  className="w-full h-11 rounded-xl text-sm font-semibold"
                  onClick={onPrimary}
                  disabled={primaryLoading}>
                  {primaryLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    primaryLabel
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
