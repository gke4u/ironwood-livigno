// Three pre-written, one-click reply templates ("available" /
// "unavailable" / "we'll confirm shortly") covering the most common
// booking-request scenarios — no AI call at click time, so no wait and no
// risk of an odd AI phrasing, unlike the on-demand draft feature. Written
// once in Italian and translated to all 12 site locales (same pattern as
// reply-labels.ts), so the guest always receives the reply in the
// language of the site they wrote from, while the owner (who reads
// Italian) always sees the Italian master text as a preview alongside
// each button — that Italian text needs no translation step either, since
// it's the original the other 11 versions were translated from, not a
// translation itself.
//
// Every template leaves an explicit, clearly-marked placeholder for price
// and any situational notes — those can't be filled in automatically, so
// the owner fills them in directly in the mail client's compose window
// after clicking, before sending.
import type { Submission } from './index';
import { replyLabelsFor } from './reply-labels';

export type QuickReplyId = 'available' | 'unavailable' | 'pending';

type QuickReplyContent = {
  placeholder: string;
  available: string;
  unavailable: string;
  pending: string;
};

const IT: QuickReplyContent = {
  placeholder: '[Inserisci qui prezzo e note]',
  available: `Grazie per averci scritto! Siamo lieti di confermarti che l'appartamento è disponibile per le date richieste ({checkin} – {checkout}{nights}, {guests} ospiti).

{placeholder}

Per procedere con la prenotazione facci sapere: ti guideremo nei prossimi passi.

A presto,
Ironwood Livigno`,
  unavailable: `Grazie per averci scritto. Purtroppo l'appartamento non è disponibile per le date richieste ({checkin} – {checkout}).

{placeholder}

Se può interessarti, possiamo proporti alcune date alternative: faccelo sapere.

Un saluto,
Ironwood Livigno`,
  pending: `Grazie per averci scritto! Abbiamo ricevuto la tua richiesta per {checkin} – {checkout} ({guests} ospiti).

{placeholder}

Ti confermiamo a breve disponibilità e prezzo.

A presto,
Ironwood Livigno`
};

const EN: QuickReplyContent = {
  placeholder: '[Insert price and notes here]',
  available: `Thank you for reaching out! We're happy to confirm the apartment is available for your requested dates ({checkin} – {checkout}{nights}, {guests} guests).

{placeholder}

To move forward with the booking, just let us know and we'll guide you through the next steps.

Best,
Ironwood Livigno`,
  unavailable: `Thank you for reaching out. Unfortunately the apartment isn't available for your requested dates ({checkin} – {checkout}).

{placeholder}

If it's helpful, we can suggest some alternative dates — just let us know.

Best regards,
Ironwood Livigno`,
  pending: `Thank you for reaching out! We've received your request for {checkin} – {checkout} ({guests} guests).

{placeholder}

We'll confirm availability and pricing shortly.

Best,
Ironwood Livigno`
};

const DE: QuickReplyContent = {
  placeholder: '[Preis und Anmerkungen hier einfügen]',
  available: `Vielen Dank für Ihre Nachricht! Wir freuen uns, Ihnen mitzuteilen, dass die Wohnung für die gewünschten Daten ({checkin} – {checkout}{nights}, {guests} Gäste) verfügbar ist.

{placeholder}

Um mit der Buchung fortzufahren, lassen Sie es uns einfach wissen — wir begleiten Sie durch die nächsten Schritte.

Viele Grüße,
Ironwood Livigno`,
  unavailable: `Vielen Dank für Ihre Nachricht. Leider ist die Wohnung für die gewünschten Daten ({checkin} – {checkout}) nicht verfügbar.

{placeholder}

Falls gewünscht, schlagen wir Ihnen gerne alternative Termine vor — lassen Sie es uns wissen.

Mit freundlichen Grüßen,
Ironwood Livigno`,
  pending: `Vielen Dank für Ihre Nachricht! Wir haben Ihre Anfrage für {checkin} – {checkout} ({guests} Gäste) erhalten.

{placeholder}

Wir bestätigen Ihnen in Kürze Verfügbarkeit und Preis.

Viele Grüße,
Ironwood Livigno`
};

const FR: QuickReplyContent = {
  placeholder: '[Insérez ici le prix et les remarques]',
  available: `Merci pour votre message ! Nous sommes heureux de vous confirmer que l'appartement est disponible pour les dates demandées ({checkin} – {checkout}{nights}, {guests} voyageurs).

{placeholder}

Pour poursuivre la réservation, faites-le nous savoir et nous vous guiderons pour la suite.

À bientôt,
Ironwood Livigno`,
  unavailable: `Merci pour votre message. Malheureusement, l'appartement n'est pas disponible pour les dates demandées ({checkin} – {checkout}).

{placeholder}

Si cela peut vous intéresser, nous pouvons vous proposer d'autres dates — faites-le nous savoir.

Cordialement,
Ironwood Livigno`,
  pending: `Merci pour votre message ! Nous avons bien reçu votre demande pour {checkin} – {checkout} ({guests} voyageurs).

{placeholder}

Nous vous confirmerons rapidement la disponibilité et le prix.

À bientôt,
Ironwood Livigno`
};

const DA: QuickReplyContent = {
  placeholder: '[Indsæt pris og bemærkninger her]',
  available: `Tak for din besked! Vi kan med glæde bekræfte, at lejligheden er ledig på de ønskede datoer ({checkin} – {checkout}{nights}, {guests} gæster).

{placeholder}

For at gå videre med bookingen, så sig endelig til, så guider vi dig gennem de næste trin.

De bedste hilsner,
Ironwood Livigno`,
  unavailable: `Tak for din besked. Desværre er lejligheden ikke ledig på de ønskede datoer ({checkin} – {checkout}).

{placeholder}

Hvis det er relevant, kan vi foreslå nogle alternative datoer — sig endelig til.

Venlig hilsen,
Ironwood Livigno`,
  pending: `Tak for din besked! Vi har modtaget din forespørgsel for {checkin} – {checkout} ({guests} gæster).

{placeholder}

Vi bekræfter snarest ledighed og pris.

De bedste hilsner,
Ironwood Livigno`
};

const PL: QuickReplyContent = {
  placeholder: '[Wstaw tutaj cenę i uwagi]',
  available: `Dziękujemy za wiadomość! Miło nam potwierdzić, że apartament jest dostępny w wybranym terminie ({checkin} – {checkout}{nights}, {guests} gości).

{placeholder}

Aby przejść do rezerwacji, daj nam znać — przeprowadzimy Cię przez kolejne kroki.

Pozdrawiamy,
Ironwood Livigno`,
  unavailable: `Dziękujemy za wiadomość. Niestety apartament nie jest dostępny w wybranym terminie ({checkin} – {checkout}).

{placeholder}

Jeśli chcesz, możemy zaproponować alternatywne terminy — daj nam znać.

Pozdrawiamy,
Ironwood Livigno`,
  pending: `Dziękujemy za wiadomość! Otrzymaliśmy Twoje zapytanie na termin {checkin} – {checkout} ({guests} gości).

{placeholder}

Wkrótce potwierdzimy dostępność i cenę.

Pozdrawiamy,
Ironwood Livigno`
};

const CS: QuickReplyContent = {
  placeholder: '[Sem vložte cenu a poznámky]',
  available: `Děkujeme za zprávu! S radostí potvrzujeme, že apartmán je k dispozici ve vámi požadovaném termínu ({checkin} – {checkout}{nights}, {guests} hostů).

{placeholder}

Pro pokračování v rezervaci nám dejte vědět — provedeme vás dalšími kroky.

S pozdravem,
Ironwood Livigno`,
  unavailable: `Děkujeme za zprávu. Bohužel apartmán není k dispozici ve vámi požadovaném termínu ({checkin} – {checkout}).

{placeholder}

Pokud by se to hodilo, můžeme navrhnout alternativní termíny — dejte nám vědět.

S pozdravem,
Ironwood Livigno`,
  pending: `Děkujeme za zprávu! Obdrželi jsme vaši poptávku na termín {checkin} – {checkout} ({guests} hostů).

{placeholder}

Brzy vám potvrdíme dostupnost a cenu.

S pozdravem,
Ironwood Livigno`
};

const NO: QuickReplyContent = {
  placeholder: '[Sett inn pris og notater her]',
  available: `Takk for meldingen din! Vi bekrefter gjerne at leiligheten er ledig for de ønskede datoene ({checkin} – {checkout}{nights}, {guests} gjester).

{placeholder}

For å gå videre med bookingen, bare si ifra, så veileder vi deg gjennom de neste stegene.

Vennlig hilsen,
Ironwood Livigno`,
  unavailable: `Takk for meldingen din. Dessverre er leiligheten ikke ledig for de ønskede datoene ({checkin} – {checkout}).

{placeholder}

Om det er aktuelt, kan vi foreslå alternative datoer — bare si ifra.

Vennlig hilsen,
Ironwood Livigno`,
  pending: `Takk for meldingen din! Vi har mottatt forespørselen din for {checkin} – {checkout} ({guests} gjester).

{placeholder}

Vi bekrefter tilgjengelighet og pris snarlig.

Vennlig hilsen,
Ironwood Livigno`
};

const NL: QuickReplyContent = {
  placeholder: '[Vul hier prijs en opmerkingen in]',
  available: `Bedankt voor uw bericht! We bevestigen graag dat het appartement beschikbaar is voor de gewenste data ({checkin} – {checkout}{nights}, {guests} gasten).

{placeholder}

Om verder te gaan met de boeking, laat het ons weten — we begeleiden u door de volgende stappen.

Met vriendelijke groet,
Ironwood Livigno`,
  unavailable: `Bedankt voor uw bericht. Helaas is het appartement niet beschikbaar voor de gewenste data ({checkin} – {checkout}).

{placeholder}

Als dat interessant is, kunnen we alternatieve data voorstellen — laat het ons weten.

Met vriendelijke groet,
Ironwood Livigno`,
  pending: `Bedankt voor uw bericht! We hebben uw aanvraag ontvangen voor {checkin} – {checkout} ({guests} gasten).

{placeholder}

We bevestigen binnenkort de beschikbaarheid en de prijs.

Met vriendelijke groet,
Ironwood Livigno`
};

const ZH: QuickReplyContent = {
  placeholder: '[请在此处填写价格和备注]',
  available: `感谢您的来信!我们很高兴地确认,公寓在您所需的日期({checkin} – {checkout}{nights},{guests}位客人)内是可预订的。

{placeholder}

如需继续预订,请告诉我们,我们将为您指引后续步骤。

此致,
Ironwood Livigno`,
  unavailable: `感谢您的来信。很抱歉,公寓在您所需的日期({checkin} – {checkout})内暂无空房。

{placeholder}

如果您有兴趣,我们可以为您推荐其他可选日期,请告诉我们。

此致,
Ironwood Livigno`,
  pending: `感谢您的来信!我们已收到您关于 {checkin} – {checkout}({guests}位客人)的咨询。

{placeholder}

我们会尽快确认空房情况和价格。

此致,
Ironwood Livigno`
};

const JA: QuickReplyContent = {
  placeholder: '[ここに料金と備考を入力してください]',
  available: `ご連絡ありがとうございます!ご希望の日程({checkin} – {checkout}{nights}、{guests}名様)にて、アパートメントのご利用が可能であることを確認いたしました。

{placeholder}

ご予約を進められる場合はお知らせください。次のステップをご案内いたします。

よろしくお願いいたします。
Ironwood Livigno`,
  unavailable: `ご連絡ありがとうございます。誠に申し訳ございませんが、ご希望の日程({checkin} – {checkout})はご利用いただけません。

{placeholder}

もしよろしければ、代替日程をご提案することも可能です。お知らせください。

よろしくお願いいたします。
Ironwood Livigno`,
  pending: `ご連絡ありがとうございます!{checkin} – {checkout}({guests}名様)のお問い合わせを受け付けました。

{placeholder}

近日中に空室状況と料金をご確認の上、ご連絡いたします。

よろしくお願いいたします。
Ironwood Livigno`
};

const QUICK_REPLIES: Record<string, QuickReplyContent> = {
  it: IT,
  en: EN,
  'en-us': EN,
  de: DE,
  fr: FR,
  da: DA,
  pl: PL,
  cs: CS,
  no: NO,
  nl: NL,
  zh: ZH,
  ja: JA
};

// Only the checkmark (U+2713) is used as a leading glyph — it has
// near-universal font support (part of the long-established Dingbats
// block). The "unavailable"/"pending" symbols originally used (✗, ⏳) don't
// render reliably in every mail client/font and showed up as broken
// placeholder glyphs — dropped in favor of plain text plus a distinct
// accent color per button (see email-template.ts) to tell them apart.
const BUTTON_LABELS: Record<QuickReplyId, string> = {
  available: '✓ Disponibile',
  unavailable: 'Non disponibile',
  pending: 'Confermiamo a breve'
};

export type QuickReplyOption = {
  id: QuickReplyId;
  label: string; // always Italian — this is what the owner clicks, not what the guest reads
  mailtoHref: string;
  italianPreview: string; // the IT master text, shown so the owner always knows what a click sends regardless of the guest's language
};

function fillTemplate(template: string, placeholder: string, data: Submission, nightsPhrase: string): string {
  return template
    .replace(/\{checkin\}/g, data.checkin)
    .replace(/\{checkout\}/g, data.checkout)
    .replace(/\{nights\}/g, nightsPhrase)
    .replace(/\{guests\}/g, String(data.guests))
    .replace(/\{placeholder\}/g, placeholder);
}

export function buildQuickReplies(data: Submission, nights: number | null): QuickReplyOption[] {
  const labels = replyLabelsFor(data.locale);
  const content = (data.locale && QUICK_REPLIES[data.locale]) || IT;
  const nightsWord = nights === 1 ? labels.night : labels.nights;
  const nightsPhrase = nights !== null ? ` (${nights} ${nightsWord})` : '';
  const subject = encodeURIComponent(labels.subject);

  return (Object.keys(BUTTON_LABELS) as QuickReplyId[]).map((id) => {
    const guestBody = fillTemplate(content[id], content.placeholder, data, nightsPhrase);
    const italianBody = fillTemplate(IT[id], IT.placeholder, data, nightsPhrase);
    const body = encodeURIComponent(guestBody);
    return {
      id,
      label: BUTTON_LABELS[id],
      // Same RFC 6068 rule as buildReplyMailto: the recipient address
      // before "?" stays unencoded, only subject/body are percent-encoded.
      mailtoHref: `mailto:${data.email}?subject=${subject}&body=${body}`,
      italianPreview: italianBody
    };
  });
}
