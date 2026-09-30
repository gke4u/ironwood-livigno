'use client';

import { useCallback, useRef } from 'react';

// Long press (mouse or touch) that fires `onLongPress` after `ms` without
// the pointer moving away. The click that follows the release is swallowed,
// so the element's normal link doesn't also fire. Returned props go straight
// onto the element; `onContextMenu` stops the phone's own long-press menu
// (open in new tab, link preview) from getting in the way.
export function useLongPress(onLongPress: () => void, ms = 3000) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fired = useRef(false);

  const cancel = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(() => {
    fired.current = false;
    cancel();
    timer.current = setTimeout(() => {
      fired.current = true;
      onLongPress();
    }, ms);
  }, [cancel, ms, onLongPress]);

  return {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e: React.MouseEvent) => {
      if (timer.current || fired.current) e.preventDefault();
    },
    onClick: (e: React.MouseEvent) => {
      if (fired.current) {
        e.preventDefault();
        fired.current = false;
      }
    }
  };
}
