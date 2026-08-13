'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

// Local-date helpers, deliberately avoiding the UTC parsing `new
// Date('YYYY-MM-DD')` does (that reads the string as midnight UTC, which
// rolls back a day in any timezone behind UTC — exactly the kind of
// off-by-one that breaks a check-in/check-out picker).
export function toISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
export function fromISO(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}
function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isBefore(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

// Grid always starts on Monday — this property's guests are overwhelmingly
// European, where that's the expected week layout.
function buildMonthGrid(viewMonth: Date): (Date | null)[] {
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0..Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function weekdayLabels(locale: string): string[] {
  // 2024-01-01 is a Monday — a fixed, known reference week to read the
  // locale's weekday abbreviations off, independent of the viewed month.
  const monday = new Date(2024, 0, 1);
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 1 + i)).replace('.', ''));
}

export default function DatePicker({
  id,
  value,
  onChange,
  minDate,
  excludeMinDate = false,
  invalid,
  ariaDescribedBy,
  label
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  minDate: Date;
  // The check-in picker's minDate (today) must stay selectable — same-day
  // booking is fine. The check-out picker's minDate is the chosen check-in
  // date, which must NOT be selectable there: a same-day check-out is a
  // zero-night stay, and the server already rejects checkout_iso <=
  // checkin_iso (see forms-worker/src/index.ts validate()). Without this,
  // the calendar let a guest pick identical dates, they'd only find out it
  // was invalid after submitting, from a generic error banner that doesn't
  // say which field is wrong.
  excludeMinDate?: boolean;
  invalid?: boolean;
  ariaDescribedBy?: string;
  label: string;
}) {
  const locale = useLocale();
  const t = useTranslations('request');
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => startOfDay(minDate));
  const rootRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => fromISO(value), [value]);
  const min = useMemo(() => startOfDay(minDate), [minDate]);
  const today = useMemo(() => startOfDay(new Date()), []);
  const weekdays = useMemo(() => weekdayLabels(locale), [locale]);
  const grid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  // Every time the popover opens, jump the visible month to the selected
  // date if there is one, otherwise to the allowed minimum — never to
  // "today" regardless of what was browsed last time. This is what makes
  // the check-out calendar open right on the check-in month instead of
  // resetting to the current date.
  useEffect(() => {
    if (!open) return;
    setViewMonth(startOfDay(selected && !isBefore(selected, min) ? selected : min));
  }, [open, selected, min]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(viewMonth);
  const displayValue = selected
    ? new Intl.DateTimeFormat(locale, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(selected)
    : '';

  function selectDay(day: Date) {
    onChange(toISO(day));
    setOpen(false);
  }

  function shiftMonth(delta: number) {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        className="w-full flex items-center justify-between gap-2 rounded-2xl border border-ink/12 bg-mist/40 px-4 py-3.5 text-left text-ink focus:outline-none focus:bg-white focus:border-brick focus:ring-4 focus:ring-brick/10 transition-all aria-[invalid=true]:border-brick aria-[invalid=true]:ring-brick/10"
      >
        <span className={displayValue ? '' : 'text-ink/35'}>{displayValue || '—'}</span>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-ink/40 shrink-0" aria-hidden>
          <rect x="3" y="5" width="18" height="16" rx="3" />
          <path d="M8 3v4M16 3v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={label}
          className="absolute z-30 mt-2 w-[300px] max-w-[calc(100vw-3rem)] rounded-2xl border border-ink/10 bg-white shadow-soft p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label={t('calendar_prev_month')}
              className="h-8 w-8 rounded-full flex items-center justify-center text-ink/60 hover:bg-mist hover:text-brick transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <span className="font-display text-sm text-ink capitalize">{monthLabel}</span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label={t('calendar_next_month')}
              className="h-8 w-8 rounded-full flex items-center justify-center text-ink/60 hover:bg-mist hover:text-brick transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {weekdays.map((w, i) => (
              <span key={i} className="text-center text-[10px] uppercase tracking-wide text-ink/40 py-1">
                {w}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {grid.map((day, i) => {
              if (!day) return <span key={i} />;
              const disabled = excludeMinDate ? !isBefore(min, day) : isBefore(day, min);
              const isSelected = selected ? isSameDay(day, selected) : false;
              const isToday = isSameDay(day, today);
              return (
                <div key={i} className="flex items-center justify-center">
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => selectDay(day)}
                    aria-label={new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(day)}
                    aria-current={isToday ? 'date' : undefined}
                    className={`h-9 w-9 rounded-full text-sm transition-colors ${
                      isSelected
                        ? 'bg-brick text-mist font-medium shadow-soft'
                        : disabled
                          ? 'text-ink/25 cursor-not-allowed'
                          : isToday
                            ? 'border border-gold text-ink font-medium hover:bg-mist/70'
                            : 'text-ink hover:bg-mist/70'
                    }`}
                  >
                    {day.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
