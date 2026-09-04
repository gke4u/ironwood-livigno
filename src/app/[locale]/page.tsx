import dynamic from 'next/dynamic';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import WeatherSection from '@/components/WeatherSection';
import Experience from '@/components/Experience';
import Rooms from '@/components/Rooms';
import RatesTable from '@/components/RatesTable';
import Amenities from '@/components/Amenities';
import ExtraServices from '@/components/ExtraServices';
import LocationSection from '@/components/LocationSection';
import Summer from '@/components/Summer';
import VirtualTour from '@/components/VirtualTour';

// Code-split out of the initial bundle (see BookingSection.tsx for the same
// pattern/rationale): the lightbox/keyboard-nav logic isn't needed until a
// visitor actually opens a photo, well after the hero above it has painted.
const Gallery = dynamic(() => import('@/components/Gallery'));
import BookingSection from '@/components/BookingSection';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';
import StickyWhatsApp from '@/components/StickyWhatsApp';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'ui' });
  return (
    <>
      {/* Keyboard/screen-reader accessibility: first focusable element jumps
          past the nav straight to the content. Visually hidden until
          focused (see .skip-link in globals.css). */}
      <a href="#contenuto" className="skip-link">
        {t('skip_to_content')}
      </a>
      <main id="contenuto">
      <StructuredData locale={locale} />
      <Nav locale={locale} />
      <Hero />
      <WeatherSection />
      <Gallery />
      <VirtualTour />
      <Rooms />
      <BookingSection />
      <RatesTable />
      <Amenities />
      <ExtraServices />
      <LocationSection />
      <Summer />
      <Experience locale={locale} />
      <Reviews />
      <FAQ />
      <StickyWhatsApp locale={locale} />
      <Footer locale={locale} />
      </main>
    </>
  );
}
