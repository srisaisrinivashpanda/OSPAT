import React from 'react';
import Link from 'next/link';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'mint' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export default function PillButton({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'right',
  children,
  className = '',
  ...props
}: PillButtonProps) {
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-xs tracking-wider',
    md: 'px-8 py-3.5 text-sm tracking-widest',
    lg: 'px-10 py-5 text-base tracking-[0.15em]',
  }[size];

  const variantClasses = {
    primary:
      'bg-primary text-on-primary hover:bg-primary-container shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary:
      'bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant/30 active:scale-[0.98]',
    mint: 'bg-mint-surface text-primary border border-primary/20 hover:bg-mint-surface/80 active:scale-[0.98]',
    ghost:
      'bg-transparent text-on-surface hover:bg-surface-container border border-outline-variant/40 active:scale-[0.98]',
    amber:
      'bg-amber-accent text-on-surface font-semibold hover:bg-amber-accent/90 shadow-md active:scale-[0.98]',
  }[variant];

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span className="font-label-caps uppercase">{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </>
  );

  const combinedClass = `inline-flex items-center justify-center gap-2.5 rounded-full transition-all duration-300 font-bold select-none cursor-pointer ${sizeClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {content}
      </Link>
    );
  }

  return (
    <button className={combinedClass} {...props}>
      {content}
    </button>
  );
}
