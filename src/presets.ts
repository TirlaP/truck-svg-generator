import type { Combination, Vehicle } from './types';

// ---------- Reusable vehicle factories ----------

const primeMover = (
  id: string,
  opts: { cabType?: Vehicle['cabType']; length?: number; color?: string } = {},
): Vehicle => ({
  id,
  kind: 'prime-mover',
  length: opts.length ?? 6.9,
  cabType: opts.cabType ?? 'bonneted-sleeper',
  cabColor: opts.color,
  axles: [
    { count: 1, position: 1.4, tyres: 'single', label: 'steer' },
    { count: 2, position: 5.4, spacing: 1.35, tyres: 'dual', label: 'drive' },
  ],
  attachments: [{ kind: 'turntable', position: 5.1 }],
  label: 'Prime Mover',
});

const rigidTruck = (
  id: string,
  opts: {
    cabType?: Vehicle['cabType'];
    bodyType?: Vehicle['bodyType'];
    length?: number;
    cabLength?: number;
    color?: string;
    bodyColor?: string;
    slots?: Vehicle['freightSlots'];
    axles?: Vehicle['axles'];
    towing?: boolean;
  } = {},
): Vehicle => {
  const length = opts.length ?? 10.5;
  return {
    id,
    kind: 'rigid',
    length,
    cabType: opts.cabType ?? 'light-cab-over',
    bodyType: opts.bodyType ?? 'box-van',
    cabColor: opts.color,
    bodyColor: opts.bodyColor,
    cabLength: opts.cabLength ?? 2.6,
    axles: opts.axles ?? [
      { count: 1, position: 1.5, tyres: 'single', label: 'steer' },
      { count: 2, position: length - 2.3, spacing: 1.3, tyres: 'dual', label: 'drive' },
    ],
    attachments: opts.towing
      ? [{ kind: 'drawbar-hitch', position: length - 0.2 }]
      : undefined,
    freightSlots: opts.slots,
    label: 'Rigid',
  };
};

const semi = (
  id: string,
  opts: {
    bodyType?: Vehicle['bodyType'];
    length?: number;
    slots?: Vehicle['freightSlots'];
    label?: string;
    bodyColor?: string;
    /** When true, append a rear drawbar-hitch so a dolly can couple behind. */
    towing?: boolean;
  } = {},
): Vehicle => {
  const length = opts.length ?? 13.7;
  const attachments: Vehicle['attachments'] = [{ kind: 'kingpin', position: 1.2 }];
  if (opts.towing) {
    attachments.push({ kind: 'drawbar-hitch', position: length - 0.1 });
  }
  return {
    id,
    kind: 'semi-trailer',
    length,
    bodyType: opts.bodyType ?? 'curtain-sider',
    bodyColor: opts.bodyColor,
    axles: [{ count: 3, position: length - 1.6, spacing: 1.35, tyres: 'dual', label: 'tri' }],
    attachments,
    freightSlots: opts.slots,
    label: opts.label ?? 'Semi-Trailer',
  };
};

const aTrailer = (
  id: string,
  opts: {
    bodyType?: Vehicle['bodyType'];
    length?: number;
    slots?: Vehicle['freightSlots'];
    bodyColor?: string;
  } = {},
): Vehicle => {
  const length = opts.length ?? 9.0;
  return {
    id,
    kind: 'a-trailer',
    length,
    bodyType: opts.bodyType ?? 'curtain-sider',
    bodyColor: opts.bodyColor,
    axles: [{ count: 2, position: length - 2.1, spacing: 1.35, tyres: 'dual', label: 'tandem' }],
    attachments: [
      { kind: 'kingpin', position: 1.2 },
      { kind: 'turntable', position: length - 0.7 },
    ],
    freightSlots: opts.slots,
    label: 'A-Trailer',
  };
};

const bTrailer = (
  id: string,
  opts: {
    bodyType?: Vehicle['bodyType'];
    length?: number;
    slots?: Vehicle['freightSlots'];
    bodyColor?: string;
    label?: string;
    /** When true, append a rear turntable so another trailer's kingpin can couple behind (middle of a B-triple). */
    middle?: boolean;
  } = {},
): Vehicle => {
  const length = opts.length ?? 11.5;
  const attachments: Vehicle['attachments'] = [{ kind: 'kingpin', position: 0.9 }];
  if (opts.middle) {
    attachments.push({ kind: 'turntable', position: length - 0.7 });
  }
  return {
    id,
    kind: 'b-trailer',
    length,
    bodyType: opts.bodyType ?? 'curtain-sider',
    bodyColor: opts.bodyColor,
    axles: [{ count: 2, position: length - 1.7, spacing: 1.35, tyres: 'dual', label: 'tandem' }],
    attachments,
    freightSlots: opts.slots,
    label: opts.label ?? 'B-Trailer',
  };
};

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

const dogTrailer = (
  id: string,
  opts: {
    bodyType?: Vehicle['bodyType'];
    length?: number;
    slots?: Vehicle['freightSlots'];
  } = {},
): Vehicle => {
  const length = opts.length ?? 8.0;
  return {
    id,
    kind: 'dog-trailer',
    length,
    bodyType: opts.bodyType ?? 'box-van',
    axles: [
      { count: 1, position: 0.9, tyres: 'dual' },
      { count: 1, position: length - 1.1, tyres: 'dual' },
    ],
    attachments: [{ kind: 'drawbar-eye', position: 0 }],
    freightSlots: opts.slots,
    label: 'Dog Trailer',
  };
};

// ---------- Preset combinations ----------

export const presets: Combination[] = [
  {
    name: 'Rigid Pantech',
    description: 'Light cab-over rigid truck with a box-van body and two pallet slots.',
    vehicles: [
      rigidTruck('r1', {
        cabType: 'light-cab-over',
        bodyType: 'box-van',
        length: 9.5,
        color: '#1e4d8c',
        bodyColor: '#1e40af',
        slots: [
          { start: 3.2, length: 2.8, label: 'P1', loaded: true, loadType: 'pallet-stack' },
          { start: 6.2, length: 2.8, label: 'P2', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
    ],
  },

  {
    name: 'Tipper Truck',
    description: 'Rigid tipper for bulk material (grain / sand / gravel).',
    vehicles: [
      rigidTruck('tip1', {
        cabType: 'bonneted-day',
        bodyType: 'tipper',
        length: 11.0,
        color: '#c1272d',
        bodyColor: '#eab308',
        slots: [
          { start: 4.5, length: 5.0, label: 'bulk', loaded: true, loadType: 'bulk-grain' },
        ],
      }),
    ],
  },

  {
    name: 'Semi (Curtain-Sider)',
    description: 'Prime mover + 13.7 m curtain-sider, three pallet stacks.',
    vehicles: [
      primeMover('pm1', { cabType: 'bonneted-sleeper', color: '#c1272d' }),
      semi('t1', {
        bodyType: 'curtain-sider',
        bodyColor: '#2f6b3e',
        slots: [
          { start: 1.8, length: 3.6, label: 'P1', loaded: true, loadType: 'pallet-stack' },
          { start: 5.6, length: 3.6, label: 'P2', loaded: true, loadType: 'pallet-stack' },
          { start: 9.4, length: 3.6, label: 'P3', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
    ],
  },

  {
    name: 'Refrigerated Semi',
    description: 'Prime mover + reefer trailer with drum cargo.',
    vehicles: [
      primeMover('pm2', { cabType: 'cab-over-sleeper', color: '#1e4d8c' }),
      semi('rf1', {
        bodyType: 'refrigerated',
        label: 'Reefer',
        slots: [
          { start: 2.0, length: 3.0, label: 'P1', loaded: true, loadType: 'pallet-stack' },
          { start: 5.2, length: 3.0, label: 'P2', loaded: true, loadType: 'pallet-stack' },
          { start: 8.4, length: 3.0, label: 'P3', loaded: true, loadType: 'drum-stack' },
        ],
      }),
    ],
  },

  {
    name: 'Tanker Semi',
    description: 'Prime mover + cylindrical tanker (fuel / milk / chemicals).',
    vehicles: [
      primeMover('pm3', { cabType: 'cab-over-day', color: '#cbd5e1' }),
      semi('tk1', {
        bodyType: 'tanker',
        label: 'Tanker',
        slots: [],
      }),
    ],
  },

  {
    name: 'Skeletal + 40\' Container',
    description: 'Prime mover + skeletal trailer carrying a 40-foot container.',
    vehicles: [
      primeMover('pm4', { cabType: 'bonneted-day', color: '#047857' }),
      semi('sk1', {
        bodyType: 'skeletal',
        label: 'Skeletal',
        slots: [
          { start: 0.9, length: 12.3, label: "40'", loaded: true, loadType: 'container-40' },
        ],
      }),
    ],
  },

  {
    name: 'Skeletal + 2 × 20\'',
    description: 'Skeletal trailer loaded with two 20\' containers.',
    vehicles: [
      primeMover('pm5', { cabType: 'bonneted-sleeper', color: '#1e4d8c' }),
      semi('sk2', {
        bodyType: 'skeletal',
        label: 'Skeletal',
        slots: [
          { start: 0.9, length: 6.2, label: "20'", loaded: true, loadType: 'container-20' },
          { start: 7.3, length: 6.2, label: "20'", loaded: true, loadType: 'container-20' },
        ],
      }),
    ],
  },

  {
    name: 'Low-Loader + Machinery',
    description: 'Heavy-haulage low-loader carrying an excavator.',
    vehicles: [
      primeMover('pm6', { cabType: 'bonneted-sleeper', color: '#c1272d' }),
      semi('ll1', {
        bodyType: 'low-loader',
        length: 14.5,
        label: 'Low-Loader',
        slots: [
          { start: 3.5, length: 7.5, label: 'Cat 320', loaded: true, loadType: 'machinery' },
        ],
      }),
    ],
  },

  {
    name: 'Livestock Semi',
    description: 'Prime mover + double-deck livestock crate.',
    vehicles: [
      primeMover('pm7', { cabType: 'bonneted-sleeper', color: '#78350f' }),
      semi('lv1', {
        bodyType: 'livestock',
        label: 'Livestock',
        slots: [
          { start: 1.6, length: 11.0, label: 'cattle', loaded: true, loadType: 'livestock-load' },
        ],
      }),
    ],
  },

  {
    name: 'B-Double (Curtain-Siders)',
    description: 'Prime mover + A-trailer + B-trailer (≈ 26 m overall).',
    vehicles: [
      primeMover('pm8', { cabType: 'bonneted-sleeper', color: '#1e4d8c' }),
      aTrailer('a1', {
        bodyType: 'curtain-sider',
        bodyColor: '#1d4ed8',
        slots: [
          { start: 1.7, length: 3.3, label: 'A1', loaded: true, loadType: 'pallet-stack' },
          { start: 5.2, length: 3.3, label: 'A2', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
      bTrailer('b1', {
        bodyType: 'curtain-sider',
        bodyColor: '#1d4ed8',
        slots: [
          { start: 1.4, length: 3.3, label: 'B1', loaded: true, loadType: 'pallet-stack' },
          { start: 4.9, length: 3.3, label: 'B2', loaded: true, loadType: 'pallet-stack' },
          { start: 8.4, length: 2.8, label: 'B3', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
    ],
  },

  {
    name: 'B-Double Container Set',
    description: 'B-Double carrying a 20\' + 40\' across two skeletal trailers.',
    vehicles: [
      primeMover('pm9', { cabType: 'cab-over-sleeper', color: '#c1272d' }),
      aTrailer('a2', {
        bodyType: 'skeletal',
        length: 8.1,
        slots: [{ start: 0.9, length: 6.2, label: "20'", loaded: true, loadType: 'container-20' }],
      }),
      bTrailer('b2', {
        bodyType: 'skeletal',
        length: 13.6,
        slots: [{ start: 0.9, length: 12.3, label: "40'", loaded: true, loadType: 'container-40' }],
      }),
    ],
  },

  {
    name: 'Road Train (Type 1 / Double)',
    description: 'Prime mover + semi + dolly + semi (≈ 36 m).',
    vehicles: [
      primeMover('pm10', { cabType: 'bonneted-sleeper', color: '#c1272d' }),
      semi('rt1', {
        bodyType: 'curtain-sider',
        bodyColor: '#2f6b3e',
        label: 'Lead',
        towing: true,
        slots: [
          { start: 1.8, length: 3.6, label: 'L1', loaded: true, loadType: 'pallet-stack' },
          { start: 5.6, length: 3.6, label: 'L2', loaded: true, loadType: 'pallet-stack' },
          { start: 9.4, length: 3.6, label: 'L3', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
      dolly('dly1'),
      semi('rt2', {
        bodyType: 'curtain-sider',
        bodyColor: '#2f6b3e',
        label: 'Trailer 2',
        slots: [
          { start: 1.8, length: 3.6, label: 'T1', loaded: true, loadType: 'pallet-stack' },
          { start: 5.6, length: 3.6, label: 'T2', loaded: true, loadType: 'pallet-stack' },
          { start: 9.4, length: 3.6, label: 'T3', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
    ],
  },

  {
    name: 'Road Train (Type 2 / Triple)',
    description: 'Prime mover + 3 tankers coupled via dollies (≈ 53 m).',
    vehicles: [
      primeMover('pm11', { cabType: 'bonneted-sleeper', color: '#cbd5e1' }),
      semi('tk2', { bodyType: 'tanker', label: 'Tanker 1', towing: true }),
      dolly('dly2'),
      semi('tk3', { bodyType: 'tanker', label: 'Tanker 2', towing: true }),
      dolly('dly3'),
      semi('tk4', { bodyType: 'tanker', label: 'Tanker 3' }),
    ],
  },

  {
    name: 'B-Triple',
    description: 'Prime mover + A + B + B (≈ 36 m).',
    vehicles: [
      primeMover('pm12', { cabType: 'bonneted-sleeper', color: '#059669' }),
      aTrailer('a3', {
        bodyType: 'refrigerated',
        length: 8.5,
        slots: [
          { start: 1.6, length: 5.5, label: 'A', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
      bTrailer('b3', {
        bodyType: 'refrigerated',
        length: 10.0,
        middle: true,
        slots: [
          { start: 1.4, length: 7.2, label: 'B1', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
      bTrailer('b4', {
        bodyType: 'refrigerated',
        length: 11.5,
        slots: [
          { start: 1.4, length: 8.8, label: 'B2', loaded: true, loadType: 'pallet-stack' },
        ],
      }),
    ],
  },

  {
    name: 'Rigid + Dog (Tipper)',
    description: 'Rigid tipper truck towing a dog trailer (truck-and-dog).',
    vehicles: [
      rigidTruck('rd1', {
        cabType: 'bonneted-day',
        bodyType: 'tipper',
        length: 11.0,
        color: '#c1272d',
        bodyColor: '#eab308',
        towing: true,
        slots: [{ start: 4.5, length: 5.2, label: 'load', loaded: true, loadType: 'bulk-grain' }],
      }),
      dogTrailer('dg1', {
        bodyType: 'tipper',
        length: 8.5,
        slots: [{ start: 1.2, length: 6.2, label: 'load', loaded: true, loadType: 'bulk-grain' }],
      }),
    ],
  },

  {
    name: 'Car Carrier Semi',
    description: 'Prime mover + two-deck car carrier with 4 vehicles.',
    vehicles: [
      primeMover('pm13', { cabType: 'cab-over-day', color: '#1e4d8c' }),
      semi('cc1', {
        bodyType: 'car-carrier',
        length: 13.0,
        label: 'Car Carrier',
        slots: [
          { start: 1.8, length: 4.6, label: 'Car', loaded: true, loadType: 'car' },
          { start: 7.0, length: 4.6, label: 'Car', loaded: true, loadType: 'car' },
        ],
      }),
    ],
  },
];
