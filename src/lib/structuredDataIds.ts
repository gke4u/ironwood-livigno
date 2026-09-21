// Stable @id values for the two entities every JSON-LD block on the site
// refers back to. JSON-LD nodes with the same @id are the same entity, so
// pages can point at "the business" and "the website" by reference instead
// of each re-describing them slightly differently (which is how they had
// drifted: a bare {name, url} here, a {name, logo} there).
//
// The business is a LodgingBusiness, which is a schema.org subtype of
// Organization — so the same @id is used for the full LodgingBusiness node
// on the homepage (StructuredData.tsx) and for the publisher/author of
// blog posts, where it is typed as a plain Organization.
export const orgId = (siteUrl: string) => `${siteUrl}/#organization`;
export const websiteId = (siteUrl: string) => `${siteUrl}/#website`;

// apple-touch-icon.png is square and 180×180 — above Google's 112×112
// minimum for a publisher/organization logo.
export function organizationRef(siteUrl: string) {
  return {
    '@type': 'Organization',
    '@id': orgId(siteUrl),
    name: 'Ironwood Livigno',
    url: siteUrl,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/apple-touch-icon.png`, width: 180, height: 180 }
  };
}
