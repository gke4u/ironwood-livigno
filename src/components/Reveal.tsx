'use client';

import { useEffect, useRef, type ReactNode } from 'react';

// Safety net for the observer below: a fast fling (or a jump to an anchor)
// can carry an element from below the screen to above it between two frames,
// and an IntersectionObserver only reports changes of "visible or not" — so
// it would never fire and the element would stay hidden. One shared, light
// scroll listener reveals anything that has reached the screen.
const pending = new Set<() => boolean>();
let listening = false;
let scheduled = false;
function sweep() {
  scheduled = false;
  pending.forEach((check) => {
    if (check()) pending.delete(check);
  });
  if (!pending.size && listening) {
    window.removeEventListener('scroll', onScroll);
    listening = false;
  }
}
function onScroll() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(sweep);
  }
}
function watch(check: () => boolean) {
  pending.add(check);
  if (!listening) {
    window.addEventListener('scroll', onScroll, { passive: true });
    listening = true;
  }
  return () => pending.delete(check);
}

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

    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      node.style.animationDelay = `${delay}ms`;
      node.classList.remove('reveal-pending');
      node.classList.add('is-visible');
      observer.disconnect();
      unwatch();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) show();
        });
      },
      { threshold: 0.15 }
    );
    // Reached or passed: its top is above the bottom of the screen.
    // The homepage section is asked first: measuring an element inside a
    // section the browser is still skipping (content-visibility) would force
    // it to lay that section out on every scroll frame.
    const section = node.closest('#sezioni > section');
    const unwatch = watch(() => {
      if (section && section.getBoundingClientRect().top >= window.innerHeight) return false;
      if (node.getBoundingClientRect().top < window.innerHeight * 0.9) {
        show();
        return true;
      }
      return false;
    });

    observer.observe(node);
    return () => {
      observer.disconnect();
      unwatch();
    };
  }, [delay]);

  return (
    <div ref={ref} className={`reveal h-full w-full ${className}`}>
      {children}
    </div>
  );
}
