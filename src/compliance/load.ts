// Load / axle-mass estimator.
// Simplifications:
//   - tare distributed evenly across a vehicle's axle groups
//   - freight mass split between the two nearest axle groups using a simple
//     lever-arm (inverse distance) rule around the slot centre
//   - for articulated combinations, 30% of the following semi-trailer's gross
//     mass is transferred to the preceding vehicle's turntable/hitch point,
//     which is itself distributed across that vehicle's axle groups
// This is an estimator, not a physics engine. Good enough for UI feedback.

import type { AxleGroup, Combination, FreightSlot, FreightType, Vehicle } from '../types';

export interface FreightMassKg {
  type: FreightType;
  /** Nominal mass (kg) for a full "one" of this freight type. */
  full: number;
  /** Per-metre mass (kg/m) when the freight scales with slot length. */
  perMetre?: number;
}

export const FREIGHT_MASSES: Record<FreightType, FreightMassKg> = {
  'container-20': { type: 'container-20', full: 24000 },
  'container-20-hc': { type: 'container-20-hc', full: 24000 },
  'container-40': { type: 'container-40', full: 30000 },
  'container-40-hc': { type: 'container-40-hc', full: 30000 },
  'pallet-stack': { type: 'pallet-stack', full: 1000 },
  'drum-stack': { type: 'drum-stack', full: 1200 },
  'iso-tank': { type: 'iso-tank', full: 26000 },
  'bulk-grain': { type: 'bulk-grain', full: 0, perMetre: 1800 },
  'livestock-load': { type: 'livestock-load', full: 20000 },
  machinery: { type: 'machinery', full: 22000 },
  crate: { type: 'crate', full: 1500 },
  car: { type: 'car', full: 1500 },
  'pipe-bundle': { type: 'pipe-bundle', full: 0, perMetre: 800 },
};

export interface AxleLoad {
  vehicleId: string;
  groupIndex: number;
  positionM: number;
  axleCount: number;
  massKg: number;
}

export interface LoadReport {
  combinationGrossMassKg: number;
  freightMassKg: number;
  axleLoads: AxleLoad[];
  tareByVehicle: Record<string, number>;
}

// ---------- tare ----------

function tareForVehicle(v: Vehicle): number {
  switch (v.kind) {
    case 'prime-mover':
      return 8500;
    case 'rigid':
      return 10000 + 200 * v.length;
    case 'semi-trailer':
      return 7500;
    case 'a-trailer':
      return 6500;
    case 'b-trailer':
      return 7500;
    case 'dog-trailer':
      return 5000;
    case 'pig-trailer':
      return 4500;
    case 'dolly':
      return 1500;
  }
}

// ---------- freight ----------

function slotMass(slot: FreightSlot): number {
  if (!slot.loaded || !slot.loadType) return 0;
  const m = FREIGHT_MASSES[slot.loadType];
  if (m.perMetre) return m.perMetre * slot.length;
  return m.full;
}

// ---------- distribution primitives ----------

/**
 * Distribute a point load applied at `applyPosM` (m from vehicle front) across
 * the vehicle's axle groups. Uses statics on the two nearest groups; if there
 * is only one group, all load goes to it.
 */
function distributePointLoad(
  v: Vehicle,
  applyPosM: number,
  massKg: number,
  accum: Record<number, number>,
): void {
  if (v.axles.length === 0 || massKg === 0) return;
  if (v.axles.length === 1) {
    accum[0] = (accum[0] ?? 0) + massKg;
    return;
  }
  // Find surrounding groups. If load is outside the span, cantilever onto
  // the nearest two groups (still sums to the mass, with possible negative
  // share on the far one; we clamp to zero and re-normalise for readability).
  const groups = v.axles.map((a, i) => ({ i, pos: a.position }));
  groups.sort((a, b) => a.pos - b.pos);

  // Find the pair that bracket applyPosM
  let left = groups[0];
  let right = groups[groups.length - 1];
  for (let k = 0; k < groups.length - 1; k++) {
    if (groups[k].pos <= applyPosM && groups[k + 1].pos >= applyPosM) {
      left = groups[k];
      right = groups[k + 1];
      break;
    }
  }
  if (applyPosM <= groups[0].pos) {
    left = groups[0];
    right = groups[1] ?? groups[0];
  } else if (applyPosM >= groups[groups.length - 1].pos) {
    right = groups[groups.length - 1];
    left = groups[groups.length - 2] ?? right;
  }

  const span = Math.max(right.pos - left.pos, 1e-3);
  let wLeft = (right.pos - applyPosM) / span;
  let wRight = (applyPosM - left.pos) / span;
  // Clamp for cantilever cases so we don't get negative shares.
  wLeft = Math.max(0, Math.min(1.2, wLeft));
  wRight = Math.max(0, Math.min(1.2, wRight));
  const sum = wLeft + wRight || 1;
  wLeft /= sum;
  wRight /= sum;

  accum[left.i] = (accum[left.i] ?? 0) + massKg * wLeft;
  if (right.i !== left.i) accum[right.i] = (accum[right.i] ?? 0) + massKg * wRight;
}

function distributeEven(v: Vehicle, massKg: number, accum: Record<number, number>): void {
  if (v.axles.length === 0 || massKg === 0) return;
  const per = massKg / v.axles.length;
  v.axles.forEach((_, i) => {
    accum[i] = (accum[i] ?? 0) + per;
  });
}

// ---------- world position helpers ----------

/** Compute approximate world-x of each vehicle's front edge. */
function computeVehicleOrigins(c: Combination): number[] {
  const origins: number[] = [];
  let cursor = 0;
  for (const v of c.vehicles) {
    origins.push(cursor);
    cursor += v.length;
  }
  return origins;
}

function turntableOrHitchPos(v: Vehicle): number | undefined {
  const att = v.attachments?.find((a) => a.kind === 'turntable' || a.kind === 'drawbar-hitch');
  return att?.position;
}

// ---------- main ----------

export function computeLoad(c: Combination): LoadReport {
  const tareByVehicle: Record<string, number> = {};
  // per-vehicle: map groupIndex -> mass
  const perVehicle: Record<string, Record<number, number>> = {};

  for (const v of c.vehicles) {
    tareByVehicle[v.id] = tareForVehicle(v);
    perVehicle[v.id] = {};
    distributeEven(v, tareByVehicle[v.id], perVehicle[v.id]);
  }

  // Freight distribution per vehicle
  let freightMassTotal = 0;
  const freightByVehicle: Record<string, number> = {};
  for (const v of c.vehicles) {
    let freight = 0;
    for (const slot of v.freightSlots ?? []) {
      const m = slotMass(slot);
      if (m <= 0) continue;
      freight += m;
      const centre = slot.start + slot.length / 2;
      distributePointLoad(v, centre, m, perVehicle[v.id]);
    }
    freightByVehicle[v.id] = freight;
    freightMassTotal += freight;
  }

  // Kingpin / drawbar transfer: 30% of a trailer's gross mass shifts forward
  // to the previous vehicle's turntable or hitch, if one exists.
  const TRANSFER_RATIO = 0.3;
  for (let i = 1; i < c.vehicles.length; i++) {
    const prev = c.vehicles[i - 1];
    const cur = c.vehicles[i];
    const curGross = tareByVehicle[cur.id] + freightByVehicle[cur.id];
    const transfer = curGross * TRANSFER_RATIO;
    // remove transfer from cur's accum evenly
    const curAxles = cur.axles.length;
    if (curAxles > 0) {
      const perAxle = transfer / curAxles;
      for (let k = 0; k < curAxles; k++) {
        perVehicle[cur.id][k] = Math.max(0, (perVehicle[cur.id][k] ?? 0) - perAxle);
      }
    }
    // apply to prev at its turntable/hitch position; fall back to rear-most axle.
    const applyPos = turntableOrHitchPos(prev) ?? (prev.axles[prev.axles.length - 1]?.position ?? prev.length);
    distributePointLoad(prev, applyPos, transfer, perVehicle[prev.id]);
  }

  // Materialise AxleLoad rows in original vehicle order.
  const origins = computeVehicleOrigins(c);
  const axleLoads: AxleLoad[] = [];
  c.vehicles.forEach((v, vi) => {
    v.axles.forEach((a: AxleGroup, gi) => {
      axleLoads.push({
        vehicleId: v.id,
        groupIndex: gi,
        positionM: origins[vi] + a.position,
        axleCount: a.count,
        massKg: perVehicle[v.id][gi] ?? 0,
      });
    });
  });

  const tareTotal = Object.values(tareByVehicle).reduce((s, x) => s + x, 0);
  return {
    combinationGrossMassKg: tareTotal + freightMassTotal,
    freightMassKg: freightMassTotal,
    axleLoads,
    tareByVehicle,
  };
}
