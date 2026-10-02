import { getTranslations } from 'next-intl/server';
import { propertyFacts as F } from '@/data/propertyFacts';

// "At a glance": the property's key facts as one definition list (<dl>), so
// a search engine or an AI assistant finds size, guests, rooms, wellness,
// distances, address and how to book in one short, self-contained block.
// Numbers and the address come from property-facts.json; the wording reuses
// the strings already shown elsewhere on the page, in the page's language.
// Server component, passed into Rooms as children: no client JavaScript.
export default async function PropertyFacts({ locale }: { locale: string }) {
  const g = await getTranslations({ locale, namespace: 'glance' });
  const hero = await getTranslations({ locale, namespace: 'hero' });
  const loc = await getTranslations({ locale, namespace: 'location' });

  const rows: [string, string][] = [
    [g('area'), g('value_area')],
    [g('guests'), hero('stat_sleeps')],
    [g('rooms'), hero('stat_rooms')],
    [g('wellness'), hero('subtitle').replace(/\.$/, '')],
    [g('ski'), `${loc('point_1')} · ${loc('point_2')}`],
    [g('centre'), loc('point_3')],
    [g('address'), `${F.location.street_address}, ${F.location.postal_code} ${F.location.locality} (SO)`],
    [g('booking'), g('value_booking')]
  ];

  return (
    <div className="mt-12 rounded-3xl bg-white/70 ring-1 ring-ink/[0.06] p-6 md:p-8">
      <h3 className="font-display text-xl md:text-2xl text-ink mb-5">{g('title')}</h3>
      <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-4 text-sm">
        {rows.map(([term, value]) => (
          <div key={term} className="border-t border-ink/[0.08] pt-3">
            <dt className="text-brick tracking-[0.15em] uppercase text-[11px] mb-1">{term}</dt>
            <dd className="text-ink/80">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
