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
  extra: string;
  breakfast: string;
  ebike: string;
  note: string;
  night: string;
  nights: string; // same as `night` for languages without a plural form (zh, ja)
};

const IT: ReplyLabels = {
  subject: 'Re: la tua richiesta a Ironwood Livigno',
  requestHeading: 'LA TUA RICHIESTA',
  checkin: 'Check-in',
  checkout: 'Check-out',
  guests: 'Ospiti',
  extra: 'Extra',
  breakfast: 'Colazione',
  ebike: 'Noleggio e-bike',
  note: 'Nota',
  night: 'notte',
  nights: 'notti'
};

export const REPLY_LABELS: Record<string, ReplyLabels> = {
  it: IT,
  en: {
    subject: 'Re: your request to Ironwood Livigno',
    requestHeading: 'YOUR REQUEST',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Guests',
    extra: 'Extras',
    breakfast: 'Breakfast',
    ebike: 'E-bike rental',
    note: 'Note',
    night: 'night',
    nights: 'nights'
  },
  'en-us': {
    subject: 'Re: your request to Ironwood Livigno',
    requestHeading: 'YOUR REQUEST',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Guests',
    extra: 'Extras',
    breakfast: 'Breakfast',
    ebike: 'E-bike rental',
    note: 'Note',
    night: 'night',
    nights: 'nights'
  },
  de: {
    subject: 'Re: Ihre Anfrage an Ironwood Livigno',
    requestHeading: 'IHRE ANFRAGE',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Gäste',
    extra: 'Extras',
    breakfast: 'Frühstück',
    ebike: 'E-Bike-Verleih',
    note: 'Notiz',
    night: 'Nacht',
    nights: 'Nächte'
  },
  fr: {
    subject: 'Re : votre demande à Ironwood Livigno',
    requestHeading: 'VOTRE DEMANDE',
    checkin: 'Arrivée',
    checkout: 'Départ',
    guests: 'Voyageurs',
    extra: 'Extras',
    breakfast: 'Petit-déjeuner',
    ebike: 'Location de vélo électrique',
    note: 'Note',
    night: 'nuit',
    nights: 'nuits'
  },
  da: {
    subject: 'Re: din forespørgsel til Ironwood Livigno',
    requestHeading: 'DIN FORESPØRGSEL',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Gæster',
    extra: 'Ekstra',
    breakfast: 'Morgenmad',
    ebike: 'El-cykeludlejning',
    note: 'Besked',
    night: 'nat',
    nights: 'nætter'
  },
  pl: {
    subject: 'Re: Twoje zapytanie do Ironwood Livigno',
    requestHeading: 'TWOJE ZAPYTANIE',
    checkin: 'Zameldowanie',
    checkout: 'Wymeldowanie',
    guests: 'Goście',
    extra: 'Dodatki',
    breakfast: 'Śniadanie',
    ebike: 'Wypożyczenie roweru elektrycznego',
    note: 'Wiadomość',
    night: 'noc',
    nights: 'noce'
  },
  cs: {
    subject: 'Re: váš dotaz na Ironwood Livigno',
    requestHeading: 'VÁŠ DOTAZ',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Hosté',
    extra: 'Extra',
    breakfast: 'Snídaně',
    ebike: 'Půjčení elektrokola',
    note: 'Zpráva',
    night: 'noc',
    nights: 'noci'
  },
  no: {
    subject: 'Re: din forespørsel til Ironwood Livigno',
    requestHeading: 'DIN FORESPØRSEL',
    checkin: 'Innsjekk',
    checkout: 'Utsjekk',
    guests: 'Gjester',
    extra: 'Ekstra',
    breakfast: 'Frokost',
    ebike: 'Utleie av elsykkel',
    note: 'Melding',
    night: 'natt',
    nights: 'netter'
  },
  nl: {
    subject: 'Re: uw aanvraag bij Ironwood Livigno',
    requestHeading: 'UW AANVRAAG',
    checkin: 'Check-in',
    checkout: 'Check-out',
    guests: 'Gasten',
    extra: "Extra's",
    breakfast: 'Ontbijt',
    ebike: 'E-bike verhuur',
    note: 'Bericht',
    night: 'nacht',
    nights: 'nachten'
  },
  zh: {
    subject: '回复：您对 Ironwood Livigno 的咨询',
    requestHeading: '您的咨询',
    checkin: '入住',
    checkout: '退房',
    guests: '人数',
    extra: '附加服务',
    breakfast: '早餐',
    ebike: '电动自行车租赁',
    note: '留言',
    night: '晚',
    nights: '晚'
  },
  ja: {
    subject: 'Re: Ironwood Livignoへのお問い合わせ',
    requestHeading: 'お問い合わせ内容',
    checkin: 'チェックイン',
    checkout: 'チェックアウト',
    guests: '人数',
    extra: '追加サービス',
    breakfast: '朝食',
    ebike: '電動自転車レンタル',
    note: 'メッセージ',
    night: '泊',
    nights: '泊'
  }
};

export function replyLabelsFor(locale: string | undefined): ReplyLabels {
  return (locale && REPLY_LABELS[locale]) || IT;
}
