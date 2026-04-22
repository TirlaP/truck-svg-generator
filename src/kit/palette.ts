// Shared colour palette for the truck kit. Flat, saturated, icon-grade.
// Everything sharable lives here so bodies/cabs/freight stay consistent.
export const palette = {
  // Cab colours
  cabRed: '#c1272d',
  cabRedDark: '#8b1a1f',
  cabBlue: '#1e4d8c',
  cabBlueDark: '#163968',
  cabWhite: '#f3f4f6',
  cabDark: '#1f2937',

  // Frame / running gear
  chassis: '#1f2937',
  chassisLight: '#374151',
  chassisMid: '#2b3444',

  // Wheels
  tyre: '#111827',
  tyreOutline: '#000',
  rim: '#9ca3af',
  rimDark: '#4b5563',
  hub: '#374151',

  // Glass / lights
  window: '#7dd3fc',
  windowDark: '#38bdf8',
  headlight: '#fde68a',
  headlightRim: '#92400e',
  markerAmber: '#f59e0b',
  markerRed: '#dc2626',

  // Bodies
  flatDeck: '#6b5b3f',
  flatDeckLight: '#8b7a5a',
  curtainTan: '#d4c28a',
  curtainGreen: '#2f6b3e',
  curtainBlue: '#1d4ed8',
  curtainTrim: '#0f172a',
  reeferBody: '#f1f5f9',
  reeferTrim: '#1e40af',
  reeferPanel: '#cbd5e1',
  tankerBody: '#d1d5db',
  tankerBand: '#9ca3af',
  tankerTrim: '#475569',
  tipperYellow: '#eab308',
  tipperYellowDark: '#a16207',
  livestockWood: '#78350f',
  livestockSlat: '#fbbf24',
  boxVanBlue: '#1e40af',
  skeletalRed: '#991b1b',

  // Freight
  container20: '#dc2626',
  container40: '#2563eb',
  container20Alt: '#059669',
  container40Alt: '#7c3aed',
  pallet: '#a16207',
  palletWrap: '#f1f5f9',
  drumBlue: '#1d4ed8',
  drumRed: '#b91c1c',
  isoTankSilver: '#e5e7eb',
  bulkGrain: '#d4a574',
  carBody: '#94a3b8',

  // Scene
  ground: '#334155',
  groundHash: '#94a3b8',
  groundShadow: 'rgba(15,23,42,0.28)',
  sky1: '#eff6ff',
  sky2: '#f8fafc',

  // Annotations
  annotation: '#334155',
  annotationMuted: '#64748b',
  slotFill: 'rgba(255,255,255,0.55)',
  slotStroke: '#6b7280',
  slotLoadedFill: '#fbbf24',
  slotLoadedStroke: '#92400e',
} as const;

export type PaletteKey = keyof typeof palette;
