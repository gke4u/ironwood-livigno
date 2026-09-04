'use client';

import type { ReactNode } from 'react';
import { useTilt, TILT_TRANSITION } from './useTilt';

// Isolates the one hook (useTilt) that forces a client boundary onto an
// otherwise-static photo card, so the section around it (headings,
// translated copy) can stay a real Server Component instead of shipping and
// hydrating just for a mouse-hover tilt effect nobody sees on first paint.
export default function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const { onMouseMove, onMouseLeave } = useTilt();
  return (
    <div onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={TILT_TRANSITION} className={className}>
      {children}
    </div>
  );
}
