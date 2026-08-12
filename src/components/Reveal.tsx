'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export default function Reveal({
  children,
  delay = 0,
  className = ''
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced-motion users: skip the fade-in, stay fully visible.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Only hide the element now that we know React mounted and this effect
    // is actually running — this is what keeps the content visible if JS
    // never loads/executes at all.
    node.classList.add('reveal-pending');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.style.animationDelay = `${delay}ms`;
            node.classList.remove('reveal-pending');
            node.classList.add('is-visible');
            observer.unobserve(node);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal h-full w-full ${className}`}>
      {children}
    </div>
  );
}
