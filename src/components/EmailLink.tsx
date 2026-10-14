'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { EMAIL_SAFE, contactEmail } from '@/lib/contactEmail';

// '' during prerender and the first client render (so hydration matches),
// the real address right after mount. See lib/contactEmail.ts for why.
export function useContactEmail(): string {
  const [email, setEmail] = useState('');
  useEffect(() => setEmail(contactEmail()), []);
  return email;
}

/** The address as text: "info [at] ironwoodlivigno.com" until mounted. */
export function EmailAddress() {
  const email = useContactEmail();
  return <>{email || EMAIL_SAFE}</>;
}

/** mailto: link whose href only exists in the browser. */
export default function EmailLink({ className, children }: { className?: string; children?: ReactNode }) {
  const email = useContactEmail();
  return (
    <a href={email ? `mailto:${email}` : undefined} className={className}>
      {children ?? (email || EMAIL_SAFE)}
    </a>
  );
}
