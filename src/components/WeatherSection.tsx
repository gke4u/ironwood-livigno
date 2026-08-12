'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Reveal from './Reveal';
import WeatherIcon, { categoryForCode, type WeatherCategory } from './WeatherIcon';

// Same coordinates as the map in LocationSection/MapEmbed.tsx (Via Saroch
// 771, Livigno), so "current weather" always matches "where the map points."
const LAT = 46.525061;
const LON = 10.126967;

const FORECAST_DAYS = 5;

type CurrentWeather = {
  temperature: number;
  windspeed: number;
  category: WeatherCategory;
};

type DailyForecast = {
  date: string;
  category: WeatherCategory;
  max: number;
  min: number;
  snowfall: number;
};

type WeatherData = {
  current: CurrentWeather;
  daily: DailyForecast[];
};

// Public, key-free API — no cookies, no personal data sent, so (unlike the
// Google Maps embed in MapEmbed.tsx) this doesn't need consent gating.
const API_URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min,snowfall_sum` +
  `&timezone=Europe%2FRome&forecast_days=${FORECAST_DAYS}`;

function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch(API_URL, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('weather fetch failed');
        return res.json();
      })
      .then((json) => {
        const daily: DailyForecast[] = json.daily.time.map((date: string, i: number) => ({
          date,
          category: categoryForCode(json.daily.weathercode[i]),
          max: Math.round(json.daily.temperature_2m_max[i]),
          min: Math.round(json.daily.temperature_2m_min[i]),
          snowfall: json.daily.snowfall_sum[i]
        }));

        setData({
          current: {
            temperature: Math.round(json.current_weather.temperature),
            windspeed: Math.round(json.current_weather.windspeed),
            category: categoryForCode(json.current_weather.weathercode)
          },
          daily
        });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(true);
      });

    return () => controller.abort();
  }, []);

  return { data, error };
}

function DayLabel({ date, isToday, locale, todayLabel }: { date: string; isToday: boolean; locale: string; todayLabel: string }) {
  if (isToday) return <>{todayLabel}</>;
  // Noon avoids the date rolling back a day in the formatter for locales
  // west of Rome (the API returns Europe/Rome calendar dates).
  const d = new Date(`${date}T12:00:00`);
  return <>{new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(d)}</>;
}

export default function WeatherSection() {
  const t = useTranslations('weather');
  const locale = useLocale();
  const { data, error } = useWeather();

  const conditionLabel = (category: WeatherCategory) => t(`condition_${category}`);

  return (
    <section id="meteo" className="bg-white py-20 md:py-24">
      <div className="max-w-content mx-auto px-6 md:px-10">
        <Reveal className="max-w-2xl mb-10">
          <p className="text-brick tracking-[0.2em] uppercase text-xs md:text-sm mb-4">{t('eyebrow')}</p>
          <h2 className="font-display text-3xl md:text-5xl text-ink mb-5 leading-tight">{t('title')}</h2>
          <p className="text-ink/70 text-base md:text-lg max-w-xl">{t('text')}</p>
        </Reveal>

        <Reveal delay={120}>
          <div className="rounded-3xl shadow-soft bg-wood-dark text-mist overflow-hidden">
            {error ? (
              <div className="p-10 text-center">
                <p className="text-mist/70 text-sm">{t('error_label')}</p>
              </div>
            ) : !data ? (
              <div className="p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 animate-pulse">
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-full bg-mist/10" />
                  <div className="space-y-2">
                    <div className="h-9 w-20 rounded bg-mist/10" />
                    <div className="h-4 w-28 rounded bg-mist/10" />
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  {Array.from({ length: FORECAST_DAYS }).map((_, i) => (
                    <div key={i} className="h-20 rounded bg-mist/10" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-10 grid md:grid-cols-[auto_1fr] gap-8 md:gap-12">
                <div className="flex items-center gap-6">
                  <WeatherIcon category={data.current.category} className="h-14 w-14 text-gold shrink-0" />
                  <div>
                    <span className="font-display text-5xl md:text-6xl leading-none">
                      {data.current.temperature}°
                    </span>
                    <p className="text-mist/80 text-sm mt-2">{conditionLabel(data.current.category)}</p>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-mist/55 text-xs">
                      <span>
                        {t('wind_label')} {data.current.windspeed} km/h
                      </span>
                      {data.daily[0].snowfall > 0 && (
                        <span>
                          {t('snow_label')} {data.daily[0].snowfall} cm
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2 md:gap-4 border-t md:border-t-0 md:border-l border-mist/15 pt-6 md:pt-0 md:pl-10">
                  {data.daily.map((day, i) => (
                    <div key={day.date} className="flex flex-col items-center text-center gap-2">
                      <span className="text-mist/55 text-[11px] md:text-xs uppercase tracking-wide">
                        <DayLabel date={day.date} isToday={i === 0} locale={locale} todayLabel={t('today_label')} />
                      </span>
                      <WeatherIcon category={day.category} className="h-6 w-6 md:h-7 md:w-7 text-mist/80" />
                      <span className="text-xs md:text-sm whitespace-nowrap">
                        <b>{day.max}°</b> <span className="text-mist/45">{day.min}°</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="px-8 md:px-10 pb-5 md:pb-6">
              <p className="text-mist/35 text-xs">{t('source_label')}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
