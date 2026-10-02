// The property's facts, read from seo-engineering/property-facts.json — the
// single source of truth that scripts/seo/facts.mjs also checks every page
// against before a deploy. Structured data takes its numbers, address,
// coordinates and contacts from here instead of repeating them by hand.
import facts from '../../seo-engineering/property-facts.json';

export const propertyFacts = facts;
