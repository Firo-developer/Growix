'use client';

import Link from 'next/link';
import {ThemeToggle} from '@/components/layout/ThemeToggle';
import {Icon} from '@/components/ui/Icon';

const navLinkClass =
  'rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-gray hover:text-heading dark:hover:bg-white/10';

type PublicHeaderProps = {
  showNav?: boolean;
};

export function PublicHeader({showNav = false}: PublicHeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 px-4 pt-3 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-border/60 bg-card/70 px-3 shadow-sm backdrop-blur-xl sm:px-4 dark:bg-card/80">
        <Link href="/" className="flex items-center gap-2.5" aria-label="Growix home">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-heading text-bg shadow-sm">
            <Icon name="star2" size={15} className="text-bg" />
          </span>
          <span className="text-sm font-semibold tracking-normal text-heading">Growix</span>
        </Link>

        {showNav ? (
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            <a href="#product" className={navLinkClass}>
              Product
            </a>
            <a href="#collaboration" className={navLinkClass}>
              Collaboration
            </a>
            <a href="#ai" className={navLinkClass}>
              AI
            </a>
            <Link href="/pricing" className={navLinkClass}>
              Pricing
            </Link>
          </nav>
        ) : (
          <nav className="hidden items-center gap-1 md:flex">
            <Link href="/#how-it-works" className={navLinkClass}>
              How it works
            </Link>
            <Link href="/pricing" className={navLinkClass}>
              Pricing
            </Link>
          </nav>
        )}

        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle className="text-muted hover:text-heading" />
          <Link
            href="/login"
            className="hidden h-9 items-center rounded-xl px-3 text-sm font-medium text-text transition-colors hover:bg-gray hover:text-heading dark:hover:bg-white/10 sm:inline-flex">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-heading px-3.5 text-sm font-medium text-bg transition-opacity hover:opacity-90">
            Start free
            {showNav && <Icon name="arrow-right4" size={14} className="text-bg" />}
          </Link>
        </div>
      </div>
    </header>
  );
}
