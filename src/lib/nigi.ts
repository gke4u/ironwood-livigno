'use client';

import { useSyncExternalStore } from 'react';

// The link between NIGI (ChatWidget.tsx) and the "Help" menu of the contact
// dock (FloatingDock.tsx): the chat says whether it is switched on, the menu
// asks it to open. No React context needed: both live on every page, mounted
// side by side in the layout.

const OPEN_EVENT = 'iw:nigi-open';
let enabled = false;
const listeners = new Set<() => void>();

export const nigi = {
  setEnabled(value: boolean) {
    if (enabled === value) return;
    enabled = value;
    listeners.forEach((fn) => fn());
  },
  open() {
    window.dispatchEvent(new Event(OPEN_EVENT));
  },
  onOpen(fn: () => void) {
    window.addEventListener(OPEN_EVENT, fn);
    return () => window.removeEventListener(OPEN_EVENT, fn);
  }
};

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useNigiEnabled(): boolean {
  return useSyncExternalStore(subscribe, () => enabled, () => false);
}
