'use client';

import { useSyncExternalStore } from 'react';

// The link between NIGI (ChatWidget.tsx) and the contact corner
// (FloatingDock.tsx): the chat says whether it is switched on, the corner
// asks it to open — optionally with a first question to ask straight away
// (the welcome bubble's ready button). No React context needed: both live on
// every page, mounted side by side in the layout.

const OPEN_EVENT = 'iw:nigi-open';
let enabled = false;
const listeners = new Set<() => void>();

export const nigi = {
  setEnabled(value: boolean) {
    if (enabled === value) return;
    enabled = value;
    listeners.forEach((fn) => fn());
  },
  open(question?: string) {
    window.dispatchEvent(new CustomEvent<string | undefined>(OPEN_EVENT, { detail: question }));
  },
  onOpen(fn: (question?: string) => void) {
    const handler = (e: Event) => fn((e as CustomEvent<string | undefined>).detail);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
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
