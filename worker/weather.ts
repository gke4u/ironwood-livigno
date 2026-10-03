// Live weather and snow for NIGI: the same free, key-free Open-Meteo feed as
// the homepage weather section (src/components/WeatherSection.tsx), at the
// apartment's coordinates. Kept in the edge cache for 30 minutes, so most
// questions cost no request at all; if the feed is down NIGI simply doesn't
// get this section and points to the site's weather instead.

const LAT = 46.525061;
const LON = 10.126967;
const DAYS = 5;
const TTL_SECONDS = 1800;
const URL_ =
  `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,weather_code,wind_speed_10m,snow_depth` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum` +
  `&timezone=Europe%2FRome&forecast_days=${DAYS}`;

type OpenMeteo = {
  current?: { time: string; temperature_2m: number; weather_code: number; wind_speed_10m: number; snow_depth?: number };
  daily?: { time: string[]; weather_code: number[]; temperature_2m_max: number[]; temperature_2m_min: number[]; snowfall_sum: number[] };
};

// WMO weather codes, in Italian (the model translates).
function describe(code: number): string {
  if (code === 0) return 'sereno';
  if (code <= 2) return 'poco nuvoloso';
  if (code === 3) return 'nuvoloso';
  if (code === 45 || code === 48) return 'nebbia';
  if (code >= 51 && code <= 57) return 'pioviggine';
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return 'pioggia';
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'neve';
  if (code >= 95) return 'temporale';
  return 'variabile';
}

function day(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
}

const r = (n: number) => Math.round(n);

async function fetchWeather(): Promise<OpenMeteo | null> {
  const key = new Request(URL_);
  const cache = caches.default;
  const hit = await cache.match(key);
  if (hit) return (await hit.json()) as OpenMeteo;
  const res = await fetch(URL_, { signal: AbortSignal.timeout(4000) });
  if (!res.ok) return null;
  const body = await res.text();
  await cache.put(key, new Response(body, { headers: { 'Content-Type': 'application/json', 'Cache-Control': `public, max-age=${TTL_SECONDS}` } }));
  return JSON.parse(body) as OpenMeteo;
}

// The weather section of NIGI's prompt, or '' when the feed is unavailable.
export async function weatherFact(): Promise<string> {
  try {
    const w = await fetchWeather();
    if (!w?.current || !w.daily) return '';
    const c = w.current;
    // Always say something about snow, so "no snow" is an answer too, not missing data.
    const snow = typeof c.snow_depth === 'number' ? (c.snow_depth > 0 ? `, neve al suolo circa ${r(c.snow_depth * 100)} cm` : ', nessuna neve al suolo') : '';
    const lines = w.daily.time.map(
      (t, i) =>
        `- ${day(t)}: ${describe(w.daily!.weather_code[i])}, min ${r(w.daily!.temperature_2m_min[i])} °C / max ${r(w.daily!.temperature_2m_max[i])} °C` +
        (w.daily!.snowfall_sum[i] > 0 ? `, nevicata prevista ${r(w.daily!.snowfall_sum[i])} cm` : ', nessuna nevicata')
    );
    return (
      `\n## Meteo a Livigno (dati in tempo reale Open-Meteo, aggiornati ${c.time.slice(11, 16)})\n` +
      `- Adesso: ${r(c.temperature_2m)} °C, ${describe(c.weather_code)}, vento ${r(c.wind_speed_10m)} km/h${snow}\n` +
      `${lines.join('\n')}\n`
    );
  } catch {
    return '';
  }
}
