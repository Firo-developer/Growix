import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl',
        'border border-dashed border-border/60 bg-gray/20',
        className,
      )}>
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-gray/60 flex items-center justify-center mb-4 text-muted">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-semibold text-heading">{title}</h3>
      {description && <p className="text-sm text-muted mt-1 max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="dark" size="sm" className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
