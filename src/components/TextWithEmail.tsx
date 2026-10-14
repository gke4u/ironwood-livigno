import { Fragment } from 'react';
import { EMAIL_SAFE } from '@/lib/contactEmail';
import EmailLink from './EmailLink';

// Content strings (FAQ answers, privacy policy) spell the address as
// "info [at] ironwoodlivigno.com"; on screen that spot becomes a real
// mailto link once the page has loaded.
export default function TextWithEmail({ text, linkClassName = 'underline hover:text-brick' }: { text: string; linkClassName?: string }) {
  const parts = text.split(EMAIL_SAFE);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <EmailLink className={linkClassName} />}
          {part}
        </Fragment>
      ))}
    </>
  );
}
