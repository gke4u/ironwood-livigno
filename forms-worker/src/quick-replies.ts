// Three pre-written reply templates ("available" / "unavailable" / "we'll
// confirm shortly") covering the most common booking-request scenarios —
// no AI call at click time, so no wait and no risk of an odd AI phrasing,
// unlike the on-demand draft feature. Written once in Italian and
// translated to all 12 site locales (same pattern as reply-labels.ts), so
// the guest always receives the reply in the language of the site they
// wrote from, while the owner (who reads Italian) always sees the Italian
// master text as a preview alongside each button — that Italian text needs
// no translation step either, since it's the original the other 11
// versions were translated from, not a translation itself.
//
// Each button leads to a reply-editor page on this Worker's own domain
// (/reply/:token/:id, see index.ts), not a mailto: link — the text below is
// only the *starting point* Francesco can still edit (e.g. filling in the
// price placeholder) before a real "Invia" sends it directly from our
// system, styled with the same branded HTML as the automatic receipt. An
// earlier version of this flow did use one-click mailto: links straight to
// the owner's own mail client; that was reverted once already per the
// owner's own feedback (he wanted the one-click behavior back), then
// deliberately reversed again later at his explicit request once he wanted
// the outgoing reply itself to look as designed as the receipt — something
// a mailto: compose window, being plain text only, can never do.
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
import { replyLabelsFor, formatGuestsSentence, type ReplyLabels } from './reply-labels';

export type QuickReplyId = 'available' | 'unavailable' | 'pending' | 'booking';

type QuickReplyContent = {
  placeholder: string;
  // Separate from `placeholder` (which is price/notes, used only in
  // "available") — this is the payment-type-and-deposit blank in "booking",
  // filled in by hand each time since the deposit amount and accepted
  // payment method vary per reservation and are never invented here.
  paymentPlaceholder: string;
  available: string;
  unavailable: string;
  pending: string;
  booking: string;
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
  paymentPlaceholder: '[Inserisci qui tipo di pagamento ed eventuale acconto richiesto]',
  available: `Gentile {name}, grazie per averci scritto! Siamo lieti di confermarLe che l'appartamento è disponibile per le date richieste {checkin} – {checkout}{nights}, {guests}.

{placeholder}

Per procedere con la prenotazione ci faccia sapere: La guideremo nei prossimi passi.

📷 {photos}

Cordiali saluti,
{signature}`,
  unavailable: `Gentile {name}, grazie per averci scritto. Purtroppo l'appartamento non è disponibile per le date richieste {checkin} – {checkout}.

Se può esserLe utile, possiamo proporLe alcune date alternative: ci faccia sapere. Speriamo comunque di poterLa ospitare in un'altra occasione.

📷 {photos}

Cordiali saluti,
{signature}`,
  pending: `Gentile {name}, grazie per averci scritto! Abbiamo ricevuto la Sua richiesta per {checkin} – {checkout}, {guests}.

Le confermiamo a breve disponibilità e prezzo.

📷 {photos}

Cordiali saluti,
{signature}`,
  booking: `Gentile {name}, che bella notizia — siamo felici di procedere con la Sua prenotazione per {checkin} – {checkout}{nights}, {guests}!

Per completare la prenotazione ci servono alcune informazioni:

• Nome, cognome e data di nascita di tutti gli ospiti (documento da esibire all'arrivo) — dato obbligatorio per la registrazione presso le autorità.
• Orario di arrivo previsto.

{payment}

Il saldo si paga direttamente in loco. È inoltre prevista l'imposta di soggiorno comunale, da versare in loco (esenti i minori di 16 anni).

Appena riceviamo questi dati Le confermiamo tutto per iscritto.

Cordiali saluti,
{signature}`
};

const EN: QuickReplyContent = {
  placeholder: '[Insert price and notes here]',
  paymentPlaceholder: '[Insert payment type and any deposit required here]',
  available: `Hi {name}, thank you for reaching out! We're happy to confirm the apartment is available for your requested dates {checkin} – {checkout}{nights}, {guests}.

{placeholder}

To move forward with the booking, just let us know and we'll guide you through the next steps.

📷 {photos}

Best,
{signature}`,
  unavailable: `Hi {name}, thank you for reaching out. Unfortunately the apartment isn't available for your requested dates {checkin} – {checkout}.

If it's helpful, we can suggest some alternative dates — just let us know. We do hope we can host you on another occasion.

📷 {photos}

Best regards,
{signature}`,
  pending: `Hi {name}, thank you for reaching out! We've received your request for {checkin} – {checkout}, {guests}.

We'll confirm availability and pricing shortly.

📷 {photos}

Best,
{signature}`,
  booking: `Hi {name}, wonderful news — we're delighted to move forward with your booking for {checkin} – {checkout}{nights}, {guests}!

To finalize the booking we just need a few details from you:

• Full name, surname and date of birth for every guest (ID to be shown on arrival) — required for mandatory guest registration with the local authorities.
• Your expected arrival time.

{payment}

The balance is paid on site. Please also note the local tourist tax, payable on site (children under 16 are exempt).

As soon as we have these details we'll confirm everything in writing.

Best,
{signature}`
};

const DE: QuickReplyContent = {
  placeholder: '[Preis und Anmerkungen hier einfügen]',
  paymentPlaceholder: '[Zahlungsart und eventuelle Anzahlung hier einfügen]',
  available: `Hallo {name}, vielen Dank für Ihre Nachricht! Wir freuen uns, Ihnen mitzuteilen, dass die Wohnung für die gewünschten Daten {checkin} – {checkout}{nights}, {guests}, verfügbar ist.

{placeholder}

Um mit der Buchung fortzufahren, lassen Sie es uns einfach wissen — wir begleiten Sie durch die nächsten Schritte.

📷 {photos}

Viele Grüße,
{signature}`,
  unavailable: `Hallo {name}, vielen Dank für Ihre Nachricht. Leider ist die Wohnung für die gewünschten Daten {checkin} – {checkout} nicht verfügbar.

Falls gewünscht, schlagen wir Ihnen gerne alternative Termine vor — lassen Sie es uns wissen. Wir hoffen, Sie bei anderer Gelegenheit bei uns begrüßen zu dürfen.

📷 {photos}

Mit freundlichen Grüßen,
{signature}`,
  pending: `Hallo {name}, vielen Dank für Ihre Nachricht! Wir haben Ihre Anfrage für {checkin} – {checkout}, {guests}, erhalten.

Wir bestätigen Ihnen in Kürze Verfügbarkeit und Preis.

📷 {photos}

Viele Grüße,
{signature}`,
  booking: `Hallo {name}, wunderbare Nachricht — wir freuen uns, mit Ihrer Buchung für {checkin} – {checkout}{nights}, {guests} fortzufahren!

Um die Buchung abzuschließen, benötigen wir noch ein paar Angaben von Ihnen:

• Vor- und Nachname sowie Geburtsdatum aller Gäste (Ausweis bei Ankunft vorzuzeigen) — erforderlich für die gesetzlich vorgeschriebene Meldung bei den Behörden.
• Ihre voraussichtliche Ankunftszeit.

{payment}

Der Restbetrag wird vor Ort bezahlt. Bitte beachten Sie außerdem die örtliche Kurtaxe, die vor Ort zu entrichten ist (Kinder unter 16 Jahren sind befreit).

Sobald wir diese Angaben haben, bestätigen wir Ihnen alles schriftlich.

Viele Grüße,
{signature}`
};

const FR: QuickReplyContent = {
  placeholder: '[Insérez ici le prix et les remarques]',
  paymentPlaceholder: '[Insérez ici le mode de paiement et un éventuel acompte]',
  available: `Bonjour {name}, merci pour votre message ! Nous sommes heureux de vous confirmer que l'appartement est disponible pour les dates demandées {checkin} – {checkout}{nights}, {guests}.

{placeholder}

Pour poursuivre la réservation, faites-le nous savoir et nous vous guiderons pour la suite.

📷 {photos}

À bientôt,
{signature}`,
  unavailable: `Bonjour {name}, merci pour votre message. Malheureusement, l'appartement n'est pas disponible pour les dates demandées {checkin} – {checkout}.

Si cela peut vous intéresser, nous pouvons vous proposer d'autres dates — faites-le nous savoir. Nous espérons avoir le plaisir de vous accueillir à une autre occasion.

📷 {photos}

Cordialement,
{signature}`,
  pending: `Bonjour {name}, merci pour votre message ! Nous avons bien reçu votre demande pour {checkin} – {checkout}, {guests}.

Nous vous confirmerons rapidement la disponibilité et le prix.

📷 {photos}

À bientôt,
{signature}`,
  booking: `Bonjour {name}, excellente nouvelle — nous sommes ravis de poursuivre votre réservation pour {checkin} – {checkout}{nights}, {guests} !

Pour finaliser la réservation, il nous faut encore quelques informations :

• Nom, prénom et date de naissance de tous les occupants (pièce d'identité à présenter à l'arrivée) — requis pour l'enregistrement obligatoire auprès des autorités.
• Votre heure d'arrivée prévue.

{payment}

Le solde est réglé sur place. Veuillez également noter la taxe de séjour locale, à régler sur place (les enfants de moins de 16 ans en sont exonérés).

Dès réception de ces informations, nous vous confirmerons tout par écrit.

À bientôt,
{signature}`
};

const DA: QuickReplyContent = {
  placeholder: '[Indsæt pris og bemærkninger her]',
  paymentPlaceholder: '[Indsæt betalingsform og eventuel udbetaling her]',
  available: `Hej {name}, tak for din besked! Vi kan med glæde bekræfte, at lejligheden er ledig på de ønskede datoer {checkin} – {checkout}{nights}, {guests}.

{placeholder}

For at gå videre med bookingen, så sig endelig til, så guider vi dig gennem de næste trin.

📷 {photos}

De bedste hilsner,
{signature}`,
  unavailable: `Hej {name}, tak for din besked. Desværre er lejligheden ikke ledig på de ønskede datoer {checkin} – {checkout}.

Hvis det er relevant, kan vi foreslå nogle alternative datoer — sig endelig til. Vi håber at kunne byde dig velkommen ved en anden lejlighed.

📷 {photos}

Venlig hilsen,
{signature}`,
  pending: `Hej {name}, tak for din besked! Vi har modtaget din forespørgsel for {checkin} – {checkout}, {guests}.

Vi bekræfter snarest ledighed og pris.

📷 {photos}

De bedste hilsner,
{signature}`,
  booking: `Hej {name}, hvor dejligt — vi glæder os til at gå videre med din booking for {checkin} – {checkout}{nights}, {guests}!

For at færdiggøre bookingen mangler vi lige et par oplysninger fra dig:

• Fulde navn og fødselsdato på alle gæster (legitimation vises ved ankomst) — påkrævet for den lovpligtige registrering hos myndighederne.
• Dit forventede ankomsttidspunkt.

{payment}

Restbeløbet betales på stedet. Bemærk også den lokale turistskat, som betales på stedet (børn under 16 år er fritaget).

Så snart vi har disse oplysninger, bekræfter vi det hele skriftligt.

De bedste hilsner,
{signature}`
};

const PL: QuickReplyContent = {
  placeholder: '[Wstaw tutaj cenę i uwagi]',
  paymentPlaceholder: '[Wstaw tutaj formę płatności i ewentualną zaliczkę]',
  available: `Dzień dobry {name}, dziękujemy za wiadomość! Miło nam potwierdzić, że apartament jest dostępny w wybranym terminie {checkin} – {checkout}{nights}, {guests}.

{placeholder}

Aby przejść do rezerwacji, daj nam znać — przeprowadzimy Cię przez kolejne kroki.

📷 {photos}

Pozdrawiamy,
{signature}`,
  unavailable: `Dzień dobry {name}, dziękujemy za wiadomość. Niestety apartament nie jest dostępny w wybranym terminie {checkin} – {checkout}.

Jeśli chcesz, możemy zaproponować alternatywne terminy — daj nam znać. Mamy nadzieję gościć Cię przy innej okazji.

📷 {photos}

Pozdrawiamy,
{signature}`,
  pending: `Dzień dobry {name}, dziękujemy za wiadomość! Otrzymaliśmy Twoje zapytanie na termin {checkin} – {checkout}, {guests}.

Wkrótce potwierdzimy dostępność i cenę.

📷 {photos}

Pozdrawiamy,
{signature}`,
  booking: `Dzień dobry {name}, wspaniała wiadomość — z przyjemnością przechodzimy do finalizacji rezerwacji na {checkin} – {checkout}{nights}, {guests}!

Aby dokończyć rezerwację, potrzebujemy jeszcze kilku informacji:

• Imię, nazwisko i data urodzenia wszystkich gości (dokument tożsamości do okazania przy przyjeździe) — wymagane do obowiązkowej rejestracji u władz lokalnych.
• Przewidywana godzina przyjazdu.

{payment}

Pozostała kwota płatna jest na miejscu. Prosimy również pamiętać o lokalnej opłacie klimatycznej, płatnej na miejscu (dzieci poniżej 16 roku życia są zwolnione).

Gdy tylko otrzymamy te dane, potwierdzimy wszystko pisemnie.

Pozdrawiamy,
{signature}`
};

const CS: QuickReplyContent = {
  placeholder: '[Sem vložte cenu a poznámky]',
  paymentPlaceholder: '[Sem vložte způsob platby a případnou zálohu]',
  available: `Dobrý den {name}, děkujeme za zprávu! S radostí potvrzujeme, že apartmán je k dispozici ve vámi požadovaném termínu {checkin} – {checkout}{nights}, {guests}.

{placeholder}

Pro pokračování v rezervaci nám dejte vědět — provedeme vás dalšími kroky.

📷 {photos}

S pozdravem,
{signature}`,
  unavailable: `Dobrý den {name}, děkujeme za zprávu. Bohužel apartmán není k dispozici ve vámi požadovaném termínu {checkin} – {checkout}.

Pokud by se to hodilo, můžeme navrhnout alternativní termíny — dejte nám vědět. Doufáme, že vás budeme moci přivítat při jiné příležitosti.

📷 {photos}

S pozdravem,
{signature}`,
  pending: `Dobrý den {name}, děkujeme za zprávu! Obdrželi jsme vaši poptávku na termín {checkin} – {checkout}, {guests}.

Brzy vám potvrdíme dostupnost a cenu.

📷 {photos}

S pozdravem,
{signature}`,
  booking: `Dobrý den {name}, skvělá zpráva — rádi budeme pokračovat s vaší rezervací na {checkin} – {checkout}{nights}, {guests}!

Pro dokončení rezervace ještě potřebujeme několik údajů:

• Jméno, příjmení a datum narození všech hostů (doklad totožnosti k předložení při příjezdu) — vyžadováno pro povinnou registraci u místních úřadů.
• Předpokládaný čas příjezdu.

{payment}

Doplatek se hradí na místě. Upozorňujeme také na místní poplatek z pobytu, splatný na místě (děti do 16 let jsou osvobozeny).

Jakmile tyto údaje obdržíme, vše vám písemně potvrdíme.

S pozdravem,
{signature}`
};

const NO: QuickReplyContent = {
  placeholder: '[Sett inn pris og notater her]',
  paymentPlaceholder: '[Sett inn betalingsmåte og eventuelt depositum her]',
  available: `Hei {name}, takk for meldingen din! Vi bekrefter gjerne at leiligheten er ledig for de ønskede datoene {checkin} – {checkout}{nights}, {guests}.

{placeholder}

For å gå videre med bookingen, bare si ifra, så veileder vi deg gjennom de neste stegene.

📷 {photos}

Vennlig hilsen,
{signature}`,
  unavailable: `Hei {name}, takk for meldingen din. Dessverre er leiligheten ikke ledig for de ønskede datoene {checkin} – {checkout}.

Om det er aktuelt, kan vi foreslå alternative datoer — bare si ifra. Vi håper å kunne ønske deg velkommen ved en annen anledning.

📷 {photos}

Vennlig hilsen,
{signature}`,
  pending: `Hei {name}, takk for meldingen din! Vi har mottatt forespørselen din for {checkin} – {checkout}, {guests}.

Vi bekrefter tilgjengelighet og pris snarlig.

📷 {photos}

Vennlig hilsen,
{signature}`,
  booking: `Hei {name}, en gledelig nyhet — vi ser frem til å gå videre med bookingen din for {checkin} – {checkout}{nights}, {guests}!

For å fullføre bookingen trenger vi noen flere opplysninger fra deg:

• Fullt navn og fødselsdato for alle gjestene (legitimasjon vises ved ankomst) — påkrevd for den lovpålagte registreringen hos myndighetene.
• Forventet ankomsttidspunkt.

{payment}

Restbeløpet betales på stedet. Vær også oppmerksom på den lokale turistskatten, som betales på stedet (barn under 16 år er fritatt).

Så snart vi har disse opplysningene, bekrefter vi alt skriftlig.

Vennlig hilsen,
{signature}`
};

const NL: QuickReplyContent = {
  placeholder: '[Vul hier prijs en opmerkingen in]',
  paymentPlaceholder: '[Vul hier de betaalmethode en eventuele aanbetaling in]',
  available: `Beste {name}, bedankt voor uw bericht! We bevestigen graag dat het appartement beschikbaar is voor de gewenste data {checkin} – {checkout}{nights}, {guests}.

{placeholder}

Om verder te gaan met de boeking, laat het ons weten — we begeleiden u door de volgende stappen.

📷 {photos}

Met vriendelijke groet,
{signature}`,
  unavailable: `Beste {name}, bedankt voor uw bericht. Helaas is het appartement niet beschikbaar voor de gewenste data {checkin} – {checkout}.

Als dat interessant is, kunnen we alternatieve data voorstellen — laat het ons weten. We hopen u bij een andere gelegenheid te mogen verwelkomen.

📷 {photos}

Met vriendelijke groet,
{signature}`,
  pending: `Beste {name}, bedankt voor uw bericht! We hebben uw aanvraag ontvangen voor {checkin} – {checkout}, {guests}.

We bevestigen binnenkort de beschikbaarheid en de prijs.

📷 {photos}

Met vriendelijke groet,
{signature}`,
  booking: `Beste {name}, geweldig nieuws — we gaan graag verder met uw boeking voor {checkin} – {checkout}{nights}, {guests}!

Om de boeking af te ronden hebben we nog een paar gegevens van u nodig:

• Volledige naam en geboortedatum van alle gasten (legitimatie te tonen bij aankomst) — verplicht voor de wettelijke registratie bij de autoriteiten.
• Uw verwachte aankomsttijd.

{payment}

Het resterende bedrag wordt ter plaatse betaald. Let ook op de lokale toeristenbelasting, te betalen ter plaatse (kinderen onder de 16 jaar zijn vrijgesteld).

Zodra we deze gegevens hebben, bevestigen we alles schriftelijk.

Met vriendelijke groet,
{signature}`
};

const ZH: QuickReplyContent = {
  placeholder: '[请在此处填写价格和备注]',
  paymentPlaceholder: '[请在此处填写付款方式及所需定金]',
  available: `{name},您好!感谢您的来信!我们很高兴地确认,公寓在您所需的日期 {checkin} – {checkout}{nights},{guests} 内是可预订的。

{placeholder}

如需继续预订,请告诉我们,我们将为您指引后续步骤。

📷 {photos}

此致,
{signature}`,
  unavailable: `{name},您好。感谢您的来信。很抱歉,公寓在您所需的日期 {checkin} – {checkout} 内暂无空房。

如果您有兴趣,我们可以为您推荐其他可选日期,请告诉我们。希望有机会在其他时间接待您。

📷 {photos}

此致,
{signature}`,
  pending: `{name},您好!感谢您的来信!我们已收到您关于 {checkin} – {checkout},{guests} 的咨询。

我们会尽快确认空房情况和价格。

📷 {photos}

此致,
{signature}`,
  booking: `{name},您好!好消息——我们很高兴为您确认 {checkin} – {checkout}{nights},{guests} 的预订!

为完成预订,我们还需要您提供以下信息:

• 所有客人的姓名及出生日期(抵达时需出示证件)——当地法律要求登记住客信息。
• 您预计的抵达时间。

{payment}

余款请在现场支付。另请注意当地的旅游税,需在现场缴纳(16岁以下儿童免收)。

收到这些信息后,我们会以书面形式为您确认所有事项。

此致,
{signature}`
};

const JA: QuickReplyContent = {
  placeholder: '[ここに料金と備考を入力してください]',
  paymentPlaceholder: '[ここに支払い方法と必要な頭金を入力してください]',
  available: `{name}様、ご連絡ありがとうございます!ご希望の日程 {checkin} – {checkout}{nights}、{guests} にて、アパートメントのご利用が可能であることを確認いたしました。

{placeholder}

ご予約を進められる場合はお知らせください。次のステップをご案内いたします。

📷 {photos}

よろしくお願いいたします。
{signature}`,
  unavailable: `{name}様、ご連絡ありがとうございます。誠に申し訳ございませんが、ご希望の日程 {checkin} – {checkout} はご利用いただけません。

もしよろしければ、代替日程をご提案することも可能です。お知らせください。またの機会にぜひお迎えできればと思います。

📷 {photos}

よろしくお願いいたします。
{signature}`,
  pending: `{name}様、ご連絡ありがとうございます!{checkin} – {checkout}、{guests} のお問い合わせを受け付けました。

近日中に空室状況と料金をご確認の上、ご連絡いたします。

📷 {photos}

よろしくお願いいたします。
{signature}`,
  booking: `{name}様、嬉しいお知らせです — {checkin} – {checkout}{nights}、{guests} でのご予約手続きを進めさせていただきます!

ご予約を完了するために、以下の情報をお知らせください:

• ご宿泊者様全員のお名前と生年月日(ご到着時に身分証明書をご提示ください)— 現地当局への登録に必要な情報です。
• ご到着予定時刻。

{payment}

残額は現地でのお支払いとなります。また、現地の宿泊税もご負担いただきます(16歳未満のお子様は免除されます)。

これらの情報をいただき次第、書面にて改めてご確認いたします。

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
  pending: 'Confermiamo a breve',
  booking: '✓ Conferma prenotazione'
};

export type QuickReplyOption = {
  id: QuickReplyId;
  label: string; // always Italian — this is what the owner clicks, not what the guest reads
  href: string; // reply-editor page on this Worker's own domain, not a mailto: link — see /reply/:token/:kind in index.ts
  italianPreview: string; // the IT master text, shown so the owner always knows what a click sends regardless of the guest's language
};

// Duplicated from email-template.ts's FORMS_BASE_URL rather than imported,
// same reasoning as PHOTOS_URL above (that file imports buildQuickReplies
// from this one, so the reverse import would be circular).
const FORMS_BASE_URL = 'https://forms.ironwoodlivigno.com';

function fillTemplate(
  template: string,
  placeholder: string,
  data: Submission,
  nightsPhrase: string,
  labels: ReplyLabels,
  paymentPlaceholder: string
): string {
  // First name only (e.g. "Kasia" not "Kasia Nowak") — same convention
  // used for the "Rispondi a {firstName}" button in email-template.ts.
  const firstName = data.name.trim().split(/\s+/)[0] || data.name;
  const values: Record<string, string> = {
    name: firstName,
    checkin: data.checkin,
    checkout: data.checkout,
    nights: nightsPhrase,
    // The full "4 adulti 2 bambini 5 anni e 12 anni" sentence, written out
    // the way the guest actually entered it — not a bare total, and not a
    // parenthetical aside for the ages.
    guests: formatGuestsSentence(labels, data.adults, data.children, data.children_ages),
    placeholder,
    // Payment type and deposit vary per booking and are filled in by hand
    // each time (see "booking" template) — same never-fabricate-a-number
    // convention already used for the price placeholder above.
    payment: paymentPlaceholder,
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
  return template.replace(/\{(name|checkin|checkout|nights|guests|placeholder|payment|photos|signature)\}/g, (_match, key: string) => values[key]);
}

// The filled, guest-language text for a single quick-reply option — used
// both by buildQuickReplies below (for the Italian preview shown next to
// each button) and directly by the /reply/:token/:kind editor page
// (index.ts) to prefill the textarea for whichever button Francesco
// clicked.
export function quickReplyText(data: Submission, nights: number | null, id: QuickReplyId): string {
  const labels = replyLabelsFor(data.locale);
  const content = (data.locale && QUICK_REPLIES[data.locale]) || IT;
  const nightsWord = nights === 1 ? labels.night : labels.nights;
  const nightsPhrase = nights !== null ? `, ${nights} ${nightsWord}` : '';
  return fillTemplate(content[id], content.placeholder, data, nightsPhrase, labels, content.paymentPlaceholder);
}

export function buildQuickReplies(data: Submission, nights: number | null, token: string): QuickReplyOption[] {
  const labels = replyLabelsFor(data.locale);
  const italianLabels = replyLabelsFor('it');
  const nightsWord = nights === 1 ? labels.night : labels.nights;
  const nightsPhrase = nights !== null ? `, ${nights} ${nightsWord}` : '';

  return (Object.keys(BUTTON_LABELS) as QuickReplyId[]).map((id) => ({
    id,
    label: BUTTON_LABELS[id],
    href: `${FORMS_BASE_URL}/reply/${token}/${id}`,
    // Italian preview always uses Italian labels for the guest count, even
    // when the guest's own site locale isn't Italian — this is the text
    // Francesco reads to know what a click is about to send, not what gets
    // sent.
    italianPreview: fillTemplate(IT[id], IT.placeholder, data, nightsPhrase, italianLabels, IT.paymentPlaceholder)
  }));
}
