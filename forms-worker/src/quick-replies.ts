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
// The Italian templates address the guest formally ("Lei"), per the
// owner's request — the other locales already used their own formal
// register where the language has one (Sie/vous/u/Pan-Pani/etc.); English
// has no formal/informal distinction, and Danish/Norwegian business
// correspondence normally uses the informal "du" even formally, so those
// were left as they were.
//
// The price/notes placeholder only appears in "available" — it's the only
// one where a price is actually relevant; "unavailable" and "pending"
// don't ask the owner to fill in anything before sending. "unavailable"
// closes with a warm line hoping to host the guest another time, instead
// of ending flatly on the bad news. Every template also includes the
// apartment photo gallery link (same bare-URL pattern as the free-form
// "Rispondi" button in email-template.ts) and ends with the same
// signature block (Francesco's name, Ironwood Livigno, and a WhatsApp
// contact link) — see SIGNATURE below.
import type { Submission } from './index';
import { replyLabelsFor } from './reply-labels';

export type QuickReplyId = 'available' | 'unavailable' | 'pending';

type QuickReplyContent = {
  placeholder: string;
  available: string;
  unavailable: string;
  pending: string;
};

// Duplicated from email-template.ts's PHOTOS_URL rather than imported —
// email-template.ts imports buildQuickReplies from this module, so an
// import the other way would be circular. A single stable URL constant is
// low-risk to keep in sync by hand.
const PHOTOS_URL = 'https://ironwoodlivigno.com/it#galleria';

// A bare wa.me link (opens a WhatsApp chat directly on any device) rather
// than a phone number formatted for a phone call — the owner specifically
// asked for a WhatsApp contact option, not a "call us" one. "WhatsApp" and
// "Francesco" are left untranslated in every locale: the brand name and
// the owner's first name don't need translating, and an identical block
// everywhere is one less thing to get wrong across 12 languages.
const SIGNATURE = 'Francesco\nIronwood Livigno\nWhatsApp: https://wa.me/390342929285';

const IT: QuickReplyContent = {
  placeholder: '[Inserisci qui prezzo e note]',
  available: `Gentile {name}, grazie per averci scritto! Siamo lieti di confermarLe che l'appartamento è disponibile per le date richieste ({checkin} – {checkout}{nights}, {guests} ospiti).

{placeholder}

Per procedere con la prenotazione ci faccia sapere: La guideremo nei prossimi passi.

📷 {photos}

Cordiali saluti,
{signature}`,
  unavailable: `Gentile {name}, grazie per averci scritto. Purtroppo l'appartamento non è disponibile per le date richieste ({checkin} – {checkout}).

Se può esserLe utile, possiamo proporLe alcune date alternative: ci faccia sapere. Speriamo comunque di poterLa ospitare in un'altra occasione.

📷 {photos}

Cordiali saluti,
{signature}`,
  pending: `Gentile {name}, grazie per averci scritto! Abbiamo ricevuto la Sua richiesta per {checkin} – {checkout} ({guests} ospiti).

Le confermiamo a breve disponibilità e prezzo.

📷 {photos}

Cordiali saluti,
{signature}`
};

const EN: QuickReplyContent = {
  placeholder: '[Insert price and notes here]',
  available: `Hi {name}, thank you for reaching out! We're happy to confirm the apartment is available for your requested dates ({checkin} – {checkout}{nights}, {guests} guests).

{placeholder}

To move forward with the booking, just let us know and we'll guide you through the next steps.

📷 {photos}

Best,
{signature}`,
  unavailable: `Hi {name}, thank you for reaching out. Unfortunately the apartment isn't available for your requested dates ({checkin} – {checkout}).

If it's helpful, we can suggest some alternative dates — just let us know. We do hope we can host you on another occasion.

📷 {photos}

Best regards,
{signature}`,
  pending: `Hi {name}, thank you for reaching out! We've received your request for {checkin} – {checkout} ({guests} guests).

We'll confirm availability and pricing shortly.

📷 {photos}

Best,
{signature}`
};

const DE: QuickReplyContent = {
  placeholder: '[Preis und Anmerkungen hier einfügen]',
  available: `Hallo {name}, vielen Dank für Ihre Nachricht! Wir freuen uns, Ihnen mitzuteilen, dass die Wohnung für die gewünschten Daten ({checkin} – {checkout}{nights}, {guests} Gäste) verfügbar ist.

{placeholder}

Um mit der Buchung fortzufahren, lassen Sie es uns einfach wissen — wir begleiten Sie durch die nächsten Schritte.

📷 {photos}

Viele Grüße,
{signature}`,
  unavailable: `Hallo {name}, vielen Dank für Ihre Nachricht. Leider ist die Wohnung für die gewünschten Daten ({checkin} – {checkout}) nicht verfügbar.

Falls gewünscht, schlagen wir Ihnen gerne alternative Termine vor — lassen Sie es uns wissen. Wir hoffen, Sie bei anderer Gelegenheit bei uns begrüßen zu dürfen.

📷 {photos}

Mit freundlichen Grüßen,
{signature}`,
  pending: `Hallo {name}, vielen Dank für Ihre Nachricht! Wir haben Ihre Anfrage für {checkin} – {checkout} ({guests} Gäste) erhalten.

Wir bestätigen Ihnen in Kürze Verfügbarkeit und Preis.

📷 {photos}

Viele Grüße,
{signature}`
};

const FR: QuickReplyContent = {
  placeholder: '[Insérez ici le prix et les remarques]',
  available: `Bonjour {name}, merci pour votre message ! Nous sommes heureux de vous confirmer que l'appartement est disponible pour les dates demandées ({checkin} – {checkout}{nights}, {guests} voyageurs).

{placeholder}

Pour poursuivre la réservation, faites-le nous savoir et nous vous guiderons pour la suite.

📷 {photos}

À bientôt,
{signature}`,
  unavailable: `Bonjour {name}, merci pour votre message. Malheureusement, l'appartement n'est pas disponible pour les dates demandées ({checkin} – {checkout}).

Si cela peut vous intéresser, nous pouvons vous proposer d'autres dates — faites-le nous savoir. Nous espérons avoir le plaisir de vous accueillir à une autre occasion.

📷 {photos}

Cordialement,
{signature}`,
  pending: `Bonjour {name}, merci pour votre message ! Nous avons bien reçu votre demande pour {checkin} – {checkout} ({guests} voyageurs).

Nous vous confirmerons rapidement la disponibilité et le prix.

📷 {photos}

À bientôt,
{signature}`
};

const DA: QuickReplyContent = {
  placeholder: '[Indsæt pris og bemærkninger her]',
  available: `Hej {name}, tak for din besked! Vi kan med glæde bekræfte, at lejligheden er ledig på de ønskede datoer ({checkin} – {checkout}{nights}, {guests} gæster).

{placeholder}

For at gå videre med bookingen, så sig endelig til, så guider vi dig gennem de næste trin.

📷 {photos}

De bedste hilsner,
{signature}`,
  unavailable: `Hej {name}, tak for din besked. Desværre er lejligheden ikke ledig på de ønskede datoer ({checkin} – {checkout}).

Hvis det er relevant, kan vi foreslå nogle alternative datoer — sig endelig til. Vi håber at kunne byde dig velkommen ved en anden lejlighed.

📷 {photos}

Venlig hilsen,
{signature}`,
  pending: `Hej {name}, tak for din besked! Vi har modtaget din forespørgsel for {checkin} – {checkout} ({guests} gæster).

Vi bekræfter snarest ledighed og pris.

📷 {photos}

De bedste hilsner,
{signature}`
};

const PL: QuickReplyContent = {
  placeholder: '[Wstaw tutaj cenę i uwagi]',
  available: `Dzień dobry {name}, dziękujemy za wiadomość! Miło nam potwierdzić, że apartament jest dostępny w wybranym terminie ({checkin} – {checkout}{nights}, {guests} gości).

{placeholder}

Aby przejść do rezerwacji, daj nam znać — przeprowadzimy Cię przez kolejne kroki.

📷 {photos}

Pozdrawiamy,
{signature}`,
  unavailable: `Dzień dobry {name}, dziękujemy za wiadomość. Niestety apartament nie jest dostępny w wybranym terminie ({checkin} – {checkout}).

Jeśli chcesz, możemy zaproponować alternatywne terminy — daj nam znać. Mamy nadzieję gościć Cię przy innej okazji.

📷 {photos}

Pozdrawiamy,
{signature}`,
  pending: `Dzień dobry {name}, dziękujemy za wiadomość! Otrzymaliśmy Twoje zapytanie na termin {checkin} – {checkout} ({guests} gości).

Wkrótce potwierdzimy dostępność i cenę.

📷 {photos}

Pozdrawiamy,
{signature}`
};

const CS: QuickReplyContent = {
  placeholder: '[Sem vložte cenu a poznámky]',
  available: `Dobrý den {name}, děkujeme za zprávu! S radostí potvrzujeme, že apartmán je k dispozici ve vámi požadovaném termínu ({checkin} – {checkout}{nights}, {guests} hostů).

{placeholder}

Pro pokračování v rezervaci nám dejte vědět — provedeme vás dalšími kroky.

📷 {photos}

S pozdravem,
{signature}`,
  unavailable: `Dobrý den {name}, děkujeme za zprávu. Bohužel apartmán není k dispozici ve vámi požadovaném termínu ({checkin} – {checkout}).

Pokud by se to hodilo, můžeme navrhnout alternativní termíny — dejte nám vědět. Doufáme, že vás budeme moci přivítat při jiné příležitosti.

📷 {photos}

S pozdravem,
{signature}`,
  pending: `Dobrý den {name}, děkujeme za zprávu! Obdrželi jsme vaši poptávku na termín {checkin} – {checkout} ({guests} hostů).

Brzy vám potvrdíme dostupnost a cenu.

📷 {photos}

S pozdravem,
{signature}`
};

const NO: QuickReplyContent = {
  placeholder: '[Sett inn pris og notater her]',
  available: `Hei {name}, takk for meldingen din! Vi bekrefter gjerne at leiligheten er ledig for de ønskede datoene ({checkin} – {checkout}{nights}, {guests} gjester).

{placeholder}

For å gå videre med bookingen, bare si ifra, så veileder vi deg gjennom de neste stegene.

📷 {photos}

Vennlig hilsen,
{signature}`,
  unavailable: `Hei {name}, takk for meldingen din. Dessverre er leiligheten ikke ledig for de ønskede datoene ({checkin} – {checkout}).

Om det er aktuelt, kan vi foreslå alternative datoer — bare si ifra. Vi håper å kunne ønske deg velkommen ved en annen anledning.

📷 {photos}

Vennlig hilsen,
{signature}`,
  pending: `Hei {name}, takk for meldingen din! Vi har mottatt forespørselen din for {checkin} – {checkout} ({guests} gjester).

Vi bekrefter tilgjengelighet og pris snarlig.

📷 {photos}

Vennlig hilsen,
{signature}`
};

const NL: QuickReplyContent = {
  placeholder: '[Vul hier prijs en opmerkingen in]',
  available: `Beste {name}, bedankt voor uw bericht! We bevestigen graag dat het appartement beschikbaar is voor de gewenste data ({checkin} – {checkout}{nights}, {guests} gasten).

{placeholder}

Om verder te gaan met de boeking, laat het ons weten — we begeleiden u door de volgende stappen.

📷 {photos}

Met vriendelijke groet,
{signature}`,
  unavailable: `Beste {name}, bedankt voor uw bericht. Helaas is het appartement niet beschikbaar voor de gewenste data ({checkin} – {checkout}).

Als dat interessant is, kunnen we alternatieve data voorstellen — laat het ons weten. We hopen u bij een andere gelegenheid te mogen verwelkomen.

📷 {photos}

Met vriendelijke groet,
{signature}`,
  pending: `Beste {name}, bedankt voor uw bericht! We hebben uw aanvraag ontvangen voor {checkin} – {checkout} ({guests} gasten).

We bevestigen binnenkort de beschikbaarheid en de prijs.

📷 {photos}

Met vriendelijke groet,
{signature}`
};

const ZH: QuickReplyContent = {
  placeholder: '[请在此处填写价格和备注]',
  available: `{name},您好!感谢您的来信!我们很高兴地确认,公寓在您所需的日期({checkin} – {checkout}{nights},{guests}位客人)内是可预订的。

{placeholder}

如需继续预订,请告诉我们,我们将为您指引后续步骤。

📷 {photos}

此致,
{signature}`,
  unavailable: `{name},您好。感谢您的来信。很抱歉,公寓在您所需的日期({checkin} – {checkout})内暂无空房。

如果您有兴趣,我们可以为您推荐其他可选日期,请告诉我们。希望有机会在其他时间接待您。

📷 {photos}

此致,
{signature}`,
  pending: `{name},您好!感谢您的来信!我们已收到您关于 {checkin} – {checkout}({guests}位客人)的咨询。

我们会尽快确认空房情况和价格。

📷 {photos}

此致,
{signature}`
};

const JA: QuickReplyContent = {
  placeholder: '[ここに料金と備考を入力してください]',
  available: `{name}様、ご連絡ありがとうございます!ご希望の日程({checkin} – {checkout}{nights}、{guests}名様)にて、アパートメントのご利用が可能であることを確認いたしました。

{placeholder}

ご予約を進められる場合はお知らせください。次のステップをご案内いたします。

📷 {photos}

よろしくお願いいたします。
{signature}`,
  unavailable: `{name}様、ご連絡ありがとうございます。誠に申し訳ございませんが、ご希望の日程({checkin} – {checkout})はご利用いただけません。

もしよろしければ、代替日程をご提案することも可能です。お知らせください。またの機会にぜひお迎えできればと思います。

📷 {photos}

よろしくお願いいたします。
{signature}`,
  pending: `{name}様、ご連絡ありがとうございます!{checkin} – {checkout}({guests}名様)のお問い合わせを受け付けました。

近日中に空室状況と料金をご確認の上、ご連絡いたします。

📷 {photos}

よろしくお願いいたします。
{signature}`
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
  // First name only (e.g. "Kasia" not "Kasia Nowak") — same convention
  // used for the "Rispondi a {firstName}" button in email-template.ts.
  const firstName = data.name.trim().split(/\s+/)[0] || data.name;
  const values: Record<string, string> = {
    name: firstName,
    checkin: data.checkin,
    checkout: data.checkout,
    nights: nightsPhrase,
    guests: String(data.guests),
    placeholder,
    photos: PHOTOS_URL,
    signature: SIGNATURE
  };
  // A single pass over the *template* — not a chain of eight sequential
  // .replace() calls — is what actually matters here. Chained replaces
  // re-scan the whole string after every step, so a value substituted
  // early (e.g. the guest's own name, free text with no brace filtering
  // upstream) can itself contain a literal "{signature}" or "{photos}"
  // that a later .replace() in the chain would then match and expand —
  // guest-controlled text ending up able to inject the real signature
  // block, the photo link, or another field into a reply Francesco sends
  // under his own name. Matching every {placeholder} against the template
  // in one regex pass, with the substitution values pulled from a fixed
  // table, means inserted values are never themselves re-scanned.
  return template.replace(/\{(name|checkin|checkout|nights|guests|placeholder|photos|signature)\}/g, (_match, key: string) => values[key]);
}

export function buildQuickReplies(data: Submission, nights: number | null): QuickReplyOption[] {
  const labels = replyLabelsFor(data.locale);
  const content = (data.locale && QUICK_REPLIES[data.locale]) || IT;
  const nightsWord = nights === 1 ? labels.night : labels.nights;
  const nightsPhrase = nights !== null ? ` (${nights} ${nightsWord})` : '';
  const subject = encodeURIComponent(labels.subject);

  return (Object.keys(BUTTON_LABELS) as QuickReplyId[]).map((id) => {
    const guestBody = fillTemplate(content[id], content.placeholder, data, nightsPhrase);
    const body = encodeURIComponent(guestBody);
    return {
      id,
      label: BUTTON_LABELS[id],
      // Same RFC 6068 rule as buildReplyMailto: the recipient address
      // before "?" stays unencoded, only subject/body are percent-encoded.
      mailtoHref: `mailto:${data.email}?subject=${subject}&body=${body}`,
      italianPreview: fillTemplate(IT[id], IT.placeholder, data, nightsPhrase)
    };
  });
}
