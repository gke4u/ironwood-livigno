// Labels for the guest-facing reply (mailto subject + the plain-text quote
// of their own request) — localized to the language of the site the guest
// was browsing (data.locale), not hardcoded Italian. A German guest
// shouldn't get a reply whose subject line and field labels are in a
// language they didn't write in; only the guest's own free-text message
// stays as they wrote it (nothing to translate — they'll understand their
// own words).
export type ReplyLabels = {
  subject: string;
  requestHeading: string;
  checkin: string;
  checkout: string;
  guests: string;
  children: string;
  extra: string;
  breakfast: string;
  ebike: string;
  note: string;
  night: string;
  nights: string; // same as `night` for languages without a plural form (zh, ja)
  // The automatic "we've got your request" receipt sent to the guest right
  // after they submit (guest-receipt.ts) — a separate message from the
  // owner's own manual reply above, sent immediately and unconditionally,
  // in the language of the site the guest was browsing.
  receiptSubject: string;
  receiptGreeting: string; // "{name}" placeholder, replaced in code
  receiptIntro: string;
  receiptClosing: string; // "{name}" not used here — sign-off text only
};

const IT: ReplyLabels = {
  subject: 'Re: la tua richiesta a Ironwood Livigno',
  requestHeading: 'LA TUA RICHIESTA',
  checkin: 'Check-in',
  checkout: 'Check-out',
  guests: 'Ospiti',
  children: 'Bambini',
  extra: 'Extra',
  breakfast: 'Colazione',
  ebike: 'Noleggio e-bike',
  note: 'Nota',
  night: 'notte',
  nights: 'notti',
  // Formale ("Lei"), stesso registro delle risposte rapide (quick-replies.ts),
  // su richiesta esplicita del proprietario.
  receiptSubject: 'La Sua richiesta è arrivata — Ironwood Livigno',
  receiptGreeting: 'Gentile {name},',
  receiptIntro: 'La ringraziamo per averci scritto! Abbiamo ricevuto la Sua richiesta e Le risponderemo il prima possibile.',
  receiptClosing: 'A presto,\nFrancesco e famiglia — Ironwood Livigno'
};

export const REPLY_LABELS: Record<string, ReplyLabels> = {
  it: IT,
  en: {
    subject: 'Re: your request to Ironwood Livigno',
    requestHeading: 'YOUR REQUEST',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Guests',
    children: 'Children',
    extra: 'Extras',
    breakfast: 'Breakfast',
    ebike: 'E-bike rental',
    note: 'Note',
    night: 'night',
    nights: 'nights',
    receiptSubject: 'Your request has arrived — Ironwood Livigno',
    receiptGreeting: 'Hi {name},',
    receiptIntro: "thank you for reaching out! We've received your request and will get back to you as soon as possible.",
    receiptClosing: 'See you soon,\nFrancesco and family — Ironwood Livigno'
  },
  'en-us': {
    subject: 'Re: your request to Ironwood Livigno',
    requestHeading: 'YOUR REQUEST',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Guests',
    children: 'Children',
    extra: 'Extras',
    breakfast: 'Breakfast',
    ebike: 'E-bike rental',
    note: 'Note',
    night: 'night',
    nights: 'nights',
    receiptSubject: 'Your request has arrived — Ironwood Livigno',
    receiptGreeting: 'Hi {name},',
    receiptIntro: "thank you for reaching out! We've received your request and will get back to you as soon as possible.",
    receiptClosing: 'See you soon,\nFrancesco and family — Ironwood Livigno'
  },
  de: {
    subject: 'Re: Ihre Anfrage an Ironwood Livigno',
    requestHeading: 'IHRE ANFRAGE',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Gäste',
    children: 'Kinder',
    extra: 'Extras',
    breakfast: 'Frühstück',
    ebike: 'E-Bike-Verleih',
    note: 'Notiz',
    night: 'Nacht',
    nights: 'Nächte',
    receiptSubject: 'Ihre Anfrage ist angekommen — Ironwood Livigno',
    receiptGreeting: 'Hallo {name},',
    receiptIntro: 'vielen Dank für Ihre Nachricht! Wir haben Ihre Anfrage erhalten und melden uns so schnell wie möglich bei Ihnen.',
    receiptClosing: 'Bis bald,\nFrancesco und Familie — Ironwood Livigno'
  },
  fr: {
    subject: 'Re : votre demande à Ironwood Livigno',
    requestHeading: 'VOTRE DEMANDE',
    checkin: 'Arrivée',
    checkout: 'Départ',
    guests: 'Voyageurs',
    children: 'Enfants',
    extra: 'Extras',
    breakfast: 'Petit-déjeuner',
    ebike: 'Location de vélo électrique',
    note: 'Note',
    night: 'nuit',
    nights: 'nuits',
    receiptSubject: 'Votre demande est bien arrivée — Ironwood Livigno',
    receiptGreeting: 'Bonjour {name},',
    receiptIntro: 'merci pour votre message ! Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.',
    receiptClosing: 'À bientôt,\nFrancesco et sa famille — Ironwood Livigno'
  },
  da: {
    subject: 'Re: din forespørgsel til Ironwood Livigno',
    requestHeading: 'DIN FORESPØRGSEL',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Gæster',
    children: 'Børn',
    extra: 'Ekstra',
    breakfast: 'Morgenmad',
    ebike: 'El-cykeludlejning',
    note: 'Besked',
    night: 'nat',
    nights: 'nætter',
    receiptSubject: 'Din forespørgsel er modtaget — Ironwood Livigno',
    receiptGreeting: 'Hej {name},',
    receiptIntro: 'tak for din besked! Vi har modtaget din forespørgsel og vender tilbage til dig hurtigst muligt.',
    receiptClosing: 'Vi ses snart,\nFrancesco og familie — Ironwood Livigno'
  },
  pl: {
    subject: 'Re: Twoje zapytanie do Ironwood Livigno',
    requestHeading: 'TWOJE ZAPYTANIE',
    checkin: 'Zameldowanie',
    checkout: 'Wymeldowanie',
    guests: 'Goście',
    children: 'Dzieci',
    extra: 'Dodatki',
    breakfast: 'Śniadanie',
    ebike: 'Wypożyczenie roweru elektrycznego',
    note: 'Wiadomość',
    night: 'noc',
    nights: 'noce',
    receiptSubject: 'Twoje zapytanie dotarło — Ironwood Livigno',
    receiptGreeting: 'Dzień dobry {name},',
    receiptIntro: 'dziękujemy za wiadomość! Otrzymaliśmy Twoje zapytanie i odpowiemy najszybciej, jak to możliwe.',
    receiptClosing: 'Do zobaczenia,\nFrancesco z rodziną — Ironwood Livigno'
  },
  cs: {
    subject: 'Re: váš dotaz na Ironwood Livigno',
    requestHeading: 'VÁŠ DOTAZ',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Hosté',
    children: 'Děti',
    extra: 'Extra',
    breakfast: 'Snídaně',
    ebike: 'Půjčení elektrokola',
    note: 'Zpráva',
    night: 'noc',
    nights: 'noci',
    receiptSubject: 'Vaše poptávka dorazila — Ironwood Livigno',
    receiptGreeting: 'Dobrý den {name},',
    receiptIntro: 'děkujeme za zprávu! Obdrželi jsme vaši poptávku a odpovíme co nejdříve.',
    receiptClosing: 'Brzy na shledanou,\nFrancesco s rodinou — Ironwood Livigno'
  },
  no: {
    subject: 'Re: din forespørsel til Ironwood Livigno',
    requestHeading: 'DIN FORESPØRSEL',
    checkin: 'Innsjekk',
    checkout: 'Utsjekk',
    guests: 'Gjester',
    children: 'Barn',
    extra: 'Ekstra',
    breakfast: 'Frokost',
    ebike: 'Utleie av elsykkel',
    note: 'Melding',
    night: 'natt',
    nights: 'netter',
    receiptSubject: 'Forespørselen din har kommet frem — Ironwood Livigno',
    receiptGreeting: 'Hei {name},',
    receiptIntro: 'takk for meldingen din! Vi har mottatt forespørselen din og svarer deg så snart som mulig.',
    receiptClosing: 'Vi sees snart,\nFrancesco og familien — Ironwood Livigno'
  },
  nl: {
    subject: 'Re: uw aanvraag bij Ironwood Livigno',
    requestHeading: 'UW AANVRAAG',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Gasten',
    children: 'Kinderen',
    extra: "Extra's",
    breakfast: 'Ontbijt',
    ebike: 'E-bike verhuur',
    note: 'Bericht',
    night: 'nacht',
    nights: 'nachten',
    receiptSubject: 'Uw aanvraag is binnengekomen — Ironwood Livigno',
    receiptGreeting: 'Beste {name},',
    receiptIntro: 'bedankt voor uw bericht! We hebben uw aanvraag ontvangen en reageren zo snel mogelijk.',
    receiptClosing: 'Tot snel,\nFrancesco en familie — Ironwood Livigno'
  },
  zh: {
    subject: '回复：您对 Ironwood Livigno 的咨询',
    requestHeading: '您的咨询',
    checkin: '入住',
    checkout: '退房',
    guests: '人数',
    children: '儿童',
    extra: '附加服务',
    breakfast: '早餐',
    ebike: '电动自行车租赁',
    note: '留言',
    night: '晚',
    nights: '晚',
    receiptSubject: '您的咨询已收到 — Ironwood Livigno',
    receiptGreeting: '{name}，您好：',
    receiptIntro: '感谢您的来信!我们已收到您的咨询,会尽快回复您。',
    receiptClosing: '期待与您相见,\nFrancesco一家 — Ironwood Livigno'
  },
  ja: {
    subject: 'Re: Ironwood Livignoへのお問い合わせ',
    requestHeading: 'お問い合わせ内容',
    checkin: 'チェックイン',
    checkout: 'チェックアウト',
    guests: '人数',
    children: '子供',
    extra: '追加サービス',
    breakfast: '朝食',
    ebike: '電動自転車レンタル',
    note: 'メッセージ',
    night: '泊',
    nights: '泊',
    receiptSubject: 'お問い合わせを受け付けました — Ironwood Livigno',
    receiptGreeting: '{name}様、',
    receiptIntro: 'ご連絡ありがとうございます。お問い合わせを受け付けました。できるだけ早くご返信いたします。',
    receiptClosing: 'またお会いできるのを楽しみにしております。\nFrancescoとその家族より — Ironwood Livigno'
  }
};

export function replyLabelsFor(locale: string | undefined): ReplyLabels {
  return (locale && REPLY_LABELS[locale]) || IT;
}
