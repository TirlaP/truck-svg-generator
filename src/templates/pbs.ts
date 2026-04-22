// Factory-compliant PBS / general-access combinations, for quick loading into
// the compliance checker. All lengths chosen to sit at or under their class
// limits per CLASS_LENGTH_LIMITS in ../compliance/rules.
//
// Vehicle factories are redefined here (kept local so templates are self-
// contained; they mirror the shapes in src/presets.ts).

import type { Combination, Vehicle } from '../types';

const primeMover = (id: string, length = 6.9): Vehicle => ({
  id,
  kind: 'prime-mover',
  length,
  cabType: 'bonneted-sleeper',
  axles: [
    { count: 1, position: 1.4, tyres: 'single', label: 'steer' },
    { count: 2, position: 5.4, spacing: 1.35, tyres: 'dual', label: 'drive' },
  ],
  attachments: [{ kind: 'turntable', position: 5.1 }],
  label: 'Prime Mover',
});

const rigid = (id: string, length: number, towing = false): Vehicle => ({
  id,
  kind: 'rigid',
  length,
  cabType: 'bonneted-day',
  bodyType: 'tipper',
  cabLength: 2.6,
  axles: [
    { count: 1, position: 1.5, tyres: 'single', label: 'steer' },
    { count: 2, position: length - 2.3, spacing: 1.3, tyres: 'dual', label: 'drive' },
  ],
  attachments: towing ? [{ kind: 'drawbar-hitch', position: length - 0.2 }] : undefined,
  freightSlots: [{ start: 4.0, length: length - 5.0, label: 'bulk', loaded: true, loadType: 'bulk-grain' }],
  label: 'Rigid',
});

const semi = (id: string, length: number, label?: string): Vehicle => ({
  id,
  kind: 'semi-trailer',
  length,
  bodyType: 'curtain-sider',
  axles: [{ count: 3, position: length - 1.6, spacing: 1.35, tyres: 'dual', label: 'tri' }],
  attachments: [{ kind: 'kingpin', position: 1.2 }],
  freightSlots: [
    { start: 1.6, length: length - 3.0, label: 'load', loaded: true, loadType: 'pallet-stack' },
  ],
  label: label ?? 'Semi',
});

const aTrailer = (id: string, length: number): Vehicle => ({
  id,
  kind: 'a-trailer',
  length,
  bodyType: 'curtain-sider',
  axles: [{ count: 2, position: length - 2.1, spacing: 1.35, tyres: 'dual', label: 'tandem' }],
  attachments: [
    { kind: 'kingpin', position: 1.2 },
    { kind: 'turntable', position: length - 0.7 },
  ],
  freightSlots: [
    { start: 1.6, length: length - 3.0, label: 'A', loaded: true, loadType: 'pallet-stack' },
  ],
  label: 'A-Trailer',
});

const bTrailer = (id: string, length: number, quad = false): Vehicle => ({
  id,
  kind: 'b-trailer',
  length,
  bodyType: 'curtain-sider',
  axles: [
    quad
      ? { count: 4, position: length - 2.0, spacing: 1.3, tyres: 'dual', label: 'quad' }
      : { count: 2, position: length - 1.7, spacing: 1.35, tyres: 'dual', label: 'tandem' },
  ],
  attachments: [{ kind: 'kingpin', position: 0.9 }],
  freightSlots: [
    { start: 1.4, length: length - 2.5, label: 'B', loaded: true, loadType: 'pallet-stack' },
  ],
  label: 'B-Trailer',
});

const dolly = (id: string): Vehicle => ({
  id,
  kind: 'dolly',
  length: 3.3,
  axles: [{ count: 2, position: 2.3, spacing: 1.35, tyres: 'dual' }],
  attachments: [
    { kind: 'drawbar-eye', position: 0 },
    { kind: 'turntable', position: 2.5 },
  ],
  label: 'Dolly',
});

const dog = (id: string, length: number): Vehicle => ({
  id,
  kind: 'dog-trailer',
  length,
  bodyType: 'tipper',
  axles: [
    { count: 1, position: 0.9, tyres: 'dual' },
    { count: 2, position: length - 1.6, spacing: 1.35, tyres: 'dual' },
  ],
  attachments: [{ kind: 'drawbar-eye', position: 0 }],
  freightSlots: [{ start: 1.2, length: length - 2.6, label: 'bulk', loaded: true, loadType: 'bulk-grain' }],
  label: 'Dog',
});

// ---------- templates ----------

export const PBS_TEMPLATES: Combination[] = [
  {
    name: 'Class 1: General-Access Semi (19m)',
    description: 'Prime mover + 12.1 m tri-axle semi. Meets the 19 m general-access limit.',
    vehicles: [primeMover('pm'), semi('t1', 12.1, 'Semi')],
  },
  {
    name: 'Class 1: Truck & Dog (19m)',
    description: 'Rigid tipper towing a tandem dog trailer. Under the 19 m limit.',
    vehicles: [rigid('r1', 10.5, true), dog('d1', 8.2)],
  },
  {
    name: 'Class 2: B-Double GML (25m)',
    description: 'Prime mover + A-trailer + B-trailer. General mass limit, 25 m.',
    vehicles: [primeMover('pm'), aTrailer('a1', 8.2), bTrailer('b1', 9.9)],
  },
  {
    name: 'Class 3: B-Triple PBS (36.5m)',
    description: 'Prime mover + A + B + B under the PBS 36.5 m envelope.',
    vehicles: [primeMover('pm'), aTrailer('a1', 8.4), bTrailer('b1', 10.1), bTrailer('b2', 11.0)],
  },
  {
    name: 'PBS: A-Double Quad-Quad',
    description: 'PBS A-double with quad-axle B-trailer; tight 36.5 m build.',
    vehicles: [primeMover('pm'), semi('s1', 12.8, 'Lead'), dolly('dly'), bTrailer('b1', 13.4, true)],
  },
  {
    name: 'Type 1 Road Train (36.5m)',
    description: 'Prime mover + semi + dolly + semi. 36.5 m double road train.',
    vehicles: [primeMover('pm'), semi('s1', 12.8, 'Lead'), dolly('dly'), semi('s2', 13.4, 'Trail')],
  },
  {
    name: 'Type 2 Road Train (53.5m)',
    description: 'Prime mover + 3 semis with 2 dollies. 53.5 m triple road train.',
    vehicles: [
      primeMover('pm'),
      semi('s1', 13.4, 'Lead'),
      dolly('dly1'),
      semi('s2', 13.4, 'Mid'),
      dolly('dly2'),
      semi('s3', 13.4, 'Tail'),
    ],
  },
];
