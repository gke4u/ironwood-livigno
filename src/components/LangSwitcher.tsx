'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { locales, localeLabels, type Locale } from '@/i18n/routing';

export default function LangSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rest = pathname.split('/').slice(2).join('/');

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Cambia lingua / Change language"
        className="flex items-center gap-2 min-h-[44px] text-sm font-medium tracking-wide uppercase bg-ink text-mist border border-cream/70 rounded-full pl-3 pr-3.5 py-2.5 hover:bg-ink/90 hover:border-cream transition-colors shadow-soft"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.7 4 6 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6-4-9s1.5-6.3 4-9z" />
        </svg>
        {localeLabels[current]}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-40 bg-mist text-ink rounded-xl shadow-soft overflow-hidden z-50"
        >
          {locales.map((l) => (
            <Link
              key={l}
              href={rest ? `/${l}/${rest}` : `/${l}`}
              onClick={() => setOpen(false)}
              role="option"
              aria-selected={l === current}
              className={`flex items-center min-h-[44px] px-4 py-2 text-sm hover:bg-cream/60 ${l === current ? 'font-semibold' : ''}`}
            >
              {localeLabels[l]}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
