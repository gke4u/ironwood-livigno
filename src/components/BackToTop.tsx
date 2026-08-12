'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

// Floating scroll-to-top button, shown once the visitor has scrolled past
// the hero. Placed bottom-left so it never overlaps the WhatsApp button
// (bottom-right).
export default function BackToTop() {
  const t = useTranslations('ui');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label={t('back_to_top')}
      className="fixed bottom-6 left-6 z-50 w-11 h-11 rounded-full bg-ink text-mist shadow-soft flex items-center justify-center hover:bg-ink/90 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
