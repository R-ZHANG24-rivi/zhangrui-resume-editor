/**
 * PRISM — SITE STRUCTURE
 * Information architecture in one place. Sections and nav read from here,
 * so adding 04 / 05 later means adding one object.
 */

export const SECTIONS = [
  {
    id: 'prism',
    index: '00',
    label: 'PRISM',
    nav: 'INDEX',
    kicker: 'Portfolio 2026',
    // prism state driven when this section owns the viewport
    prismState: 'hero',
  },
  {
    id: 'white-light',
    index: '01',
    label: 'WHITE LIGHT',
    nav: 'ABOUT',
    kicker: 'All colours, reconverged',
    prismState: 'converge',
  },
  {
    id: 'spectrum',
    index: '02',
    label: 'SPECTRUM',
    nav: 'WORK',
    kicker: 'Selected works',
    prismState: 'disperse',
  },
  {
    id: 'beyond',
    index: '03',
    label: 'BEYOND',
    nav: 'BEYOND',
    kicker: 'Other facets',
    prismState: 'orbit',
  },
  {
    id: 'refraction',
    index: '04',
    label: 'REFRACTION CONTINUES',
    nav: 'CONTACT',
    kicker: 'Ending / Contact',
    prismState: 'ending',
  },
]

export const NAV_ITEMS = SECTIONS.filter((s) => s.id !== 'prism')

export const SITE = {
  name: 'PRISM',
  year: '2026',
  thesis: 'Design refracts the ordinary into possibilities.',
  narrative: 'ONE LIGHT / MULTIPLE SPECTRUMS',
  // LIGHT → PRISM → REFRACTION → SPECTRUM
  chain: ['LIGHT', 'PRISM', 'REFRACTION', 'SPECTRUM'],
}
