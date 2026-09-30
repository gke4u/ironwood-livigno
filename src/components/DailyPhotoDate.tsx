'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

// Site locale -> the tag Intl formats best with ('no' is Norwegian Bokmål).
const DATE_LOCALE: Record<string, string> = { en: 'en-GB', 'en-us': 'en-US', no: 'nb-NO' };

// Today's date in Italy, written the way each language writes it
// (30 settembre 2026, 30. September 2026, 2026年9月30日...). Computed in the
// browser because the page is static: the photo behind /foto-del-giorno
// changes at midnight Italian time, and so does this label. Rendered only
// after mount, so the prebuilt HTML never shows the build date.
export default function DailyPhotoDate() {
  const locale = useLocale();
  const [date, setDate] = useState<{ iso: string; label: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome' }).format(now);
    const label = new Intl.DateTimeFormat(DATE_LOCALE[locale] ?? locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'Europe/Rome'
    }).format(now);
    setDate({ iso, label });
  }, [locale]);

  if (!date) return null;
  return (
    <time
      dateTime={date.iso}
      className="absolute left-4 top-4 md:left-6 md:top-6 bg-ink/75 text-mist text-sm md:text-base font-medium rounded-full px-4 py-2 backdrop-blur-sm"
    >
      {date.label}
    </time>
  );
}
