import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'network';
}

export function ErrorState({
  title,
  message,
  onRetry,
  className,
  variant = 'default',
}: ErrorStateProps) {
  const Icon = variant === 'network' ? WifiOff : AlertTriangle;
  const defaultTitle =
    variant === 'network'
      ? 'Service Unavailable'
      : 'Something went wrong';
  const defaultMessage =
    variant === 'network'
      ? 'OSPAT cannot reach the decision-support service right now. Please check that the backend is running.'
      : 'An error occurred while loading this information. Please try again.';

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-6 text-center',
        className,
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-red-500" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-2">
        {title ?? defaultTitle}
      </h3>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed">
        {message ?? defaultMessage}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
