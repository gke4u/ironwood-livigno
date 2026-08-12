'use client';

import { useEffect } from 'react';

export default function BookingWidgetScript() {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'resize') {
        const iframe = document.getElementById('host-websites-booking-module') as HTMLIFrameElement | null;
        if (iframe) iframe.style.height = `${event.data.height}px`;
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return null;
}
