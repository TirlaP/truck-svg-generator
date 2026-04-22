// Australian NHVR compliance rules for truck combinations.
// Pragmatic estimator — not a legal determination. Lengths in m, masses in t.

import type { Combination, Vehicle, AttachmentKind } from '../types';
import { computeLoad } from './load';

export type Severity = 'ok' | 'info' | 'warning' | 'error';

export interface Finding {
  severity: Severity;
  code: string;
  message: string;
  detail?: string;
  vehicleId?: string;
}

export type NhvrClass =
  | 'GENERAL_ACCESS_RIGID'
  | 'GENERAL_ACCESS_SEMI'
  | 'TRUCK_AND_DOG'
  | 'B_DOUBLE_GML'
  | 'B_DOUBLE_HML'
  | 'B_TRIPLE_PBS'
  | 'A_DOUBLE_PBS'
  | 'ROAD_TRAIN_TYPE_1'
  | 'ROAD_TRAIN_TYPE_2'
  | 'UNCLASSIFIED';

export interface ValidationReport {
  overallLengthM: number;
  classMatched: NhvrClass | null;
  findings: Finding[];
  summary: { errors: number; warnings: number; infos: number };
}

export const CLASS_LENGTH_LIMITS: Record<NhvrClass, number> = {
  GENERAL_ACCESS_RIGID: 12.5,
  GENERAL_ACCESS_SEMI: 19.0,
  TRUCK_AND_DOG: 19.0,
  B_DOUBLE_GML: 25.0,
  B_DOUBLE_HML: 26.0,
  B_TRIPLE_PBS: 36.5,
  A_DOUBLE_PBS: 36.5,
  ROAD_TRAIN_TYPE_1: 36.5,
  ROAD_TRAIN_TYPE_2: 53.5,
  UNCLASSIFIED: Infinity,
};

export const AXLE_GROUP_LIMITS = {
  steerSingle: 6.0,
  singleDrive: 9.0,
  tandemDrive: 17.0,
  triAxleDrive: 22.5,
  tandemTrailer: 17.0,
  triAxleTrailer: 22.5,
  singleTrailer: 9.0,
};

// ---------- helpers ----------

const has = (v: Vehicle, k: AttachmentKind) => !!v.attachments?.some((a) => a.kind === k);
const countKind = (c: Combination, ks: Vehicle['kind'][]) =>
  c.vehicles.filter((v) => ks.includes(v.kind)).length;

export function computeOverallLength(c: Combination): number {
  return c.vehicles.reduce((s, v) => s + v.length, 0);
}

export function classifyCombination(c: Combination): NhvrClass {
  const vs = c.vehicles;
  if (vs.length === 0) return 'UNCLASSIFIED';
  const head = vs[0];
  const tail = vs.slice(1);
  const overall = computeOverallLength(c);
  const semis = countKind(c, ['semi-trailer', 'a-trailer', 'b-trailer']);
  const bCount = countKind(c, ['b-trailer']);
  const dollies = countKind(c, ['dolly']);

  if (vs.length === 1 && head.kind === 'rigid') return 'GENERAL_ACCESS_RIGID';
  if (head.kind === 'rigid' && tail.length >= 1 && tail.every((t) => t.kind === 'dog-trailer' || t.kind === 'pig-trailer'))
    return 'TRUCK_AND_DOG';

  if (head.kind === 'prime-mover') {
    if (tail.length === 1 && tail[0].kind === 'semi-trailer') return 'GENERAL_ACCESS_SEMI';
    if (bCount === 1 && dollies === 0 && semis === 2) return overall > 25.0 ? 'B_DOUBLE_HML' : 'B_DOUBLE_GML';
    if (bCount === 2 && dollies === 0 && semis === 3) return 'B_TRIPLE_PBS';
    if (dollies === 1 && semis === 2 && overall <= 36.6) return 'A_DOUBLE_PBS';
    if (dollies === 1 && semis === 2) return 'ROAD_TRAIN_TYPE_1';
    if (dollies >= 2 && semis >= 3) return 'ROAD_TRAIN_TYPE_2';
  }
  return 'UNCLASSIFIED';
}

// ---------- rule dispatch ----------

type Rule = (c: Combination, cls: NhvrClass) => Finding[];

const ruleDuplicateIds: Rule = (c) => {
  const seen = new Set<string>();
  const dup = new Set<string>();
  for (const v of c.vehicles) {
    if (seen.has(v.id)) dup.add(v.id);
    seen.add(v.id);
  }
  return [...dup].map((id) => ({
    severity: 'error',
    code: 'DUPLICATE_VEHICLE_ID',
    message: `Duplicate vehicle id: ${id}`,
    vehicleId: id,
  }));
};

const ruleMinAxles: Rule = (c) =>
  c.vehicles
    .filter((v) => !v.axles || v.axles.length < 1)
    .map((v) => ({ severity: 'error', code: 'MIN_AXLES', message: `Vehicle ${v.id} has no axle groups`, vehicleId: v.id }));

const ruleFreightSlots: Rule = (c) => {
  const out: Finding[] = [];
  for (const v of c.vehicles) {
    for (const s of v.freightSlots ?? []) {
      if (s.start + s.length > v.length + 1e-6) {
        out.push({
          severity: 'error',
          code: 'FREIGHT_SLOT_OVERFLOW',
          message: `Freight slot "${s.label ?? ''}" overruns vehicle ${v.id}`,
          detail: `slot end ${(s.start + s.length).toFixed(2)} m > vehicle length ${v.length.toFixed(2)} m`,
          vehicleId: v.id,
        });
      }
    }
  }
  return out;
};

const ruleCoupling: Rule = (c) => {
  const out: Finding[] = [];
  for (let i = 1; i < c.vehicles.length; i++) {
    const prev = c.vehicles[i - 1];
    const cur = c.vehicles[i];
    const validKingpin = has(cur, 'kingpin') && has(prev, 'turntable');
    const validDraw = has(cur, 'drawbar-eye') && has(prev, 'drawbar-hitch');
    if (!validKingpin && !validDraw) {
      out.push({
        severity: 'error',
        code: 'COUPLING_INVALID',
        message: `No valid coupling between ${prev.id} and ${cur.id}`,
        detail: 'Expected kingpin↔turntable or drawbar-eye↔drawbar-hitch.',
        vehicleId: cur.id,
      });
    }
  }
  return out;
};

const ruleDollyBetweenSemis: Rule = (c) => {
  const out: Finding[] = [];
  for (let i = 1; i < c.vehicles.length; i++) {
    const prev = c.vehicles[i - 1];
    const cur = c.vehicles[i];
    if (cur.kind === 'semi-trailer' && prev.kind === 'semi-trailer' && !has(prev, 'turntable')) {
      out.push({
        severity: 'error',
        code: 'DOLLY_REQUIRED',
        message: `Dolly required between ${prev.id} and ${cur.id}`,
        detail: 'Two semi-trailers cannot couple directly — insert a dolly.',
        vehicleId: cur.id,
      });
    }
  }
  return out;
};

const rulePrimeMoverAxles: Rule = (c) => {
  const out: Finding[] = [];
  const pm = c.vehicles.find((v) => v.kind === 'prime-mover');
  if (!pm) return out;
  const hasSteer = pm.axles.some((a) => a.label?.toLowerCase().includes('steer') || a.count === 1);
  const hasDrive = pm.axles.some((a) => a.label?.toLowerCase().includes('drive') || a.count >= 2);
  if (!hasSteer) out.push({ severity: 'warning', code: 'PM_NO_STEER', message: `Prime mover ${pm.id} appears to have no steer axle`, vehicleId: pm.id });
  if (!hasDrive) out.push({ severity: 'warning', code: 'PM_NO_DRIVE', message: `Prime mover ${pm.id} appears to have no drive group`, vehicleId: pm.id });
  return out;
};

const ruleTyreStyles: Rule = (c) => {
  const out: Finding[] = [];
  for (const v of c.vehicles) {
    for (const a of v.axles) {
      const isSteer = a.label?.toLowerCase().includes('steer');
      if (isSteer && a.tyres && a.tyres !== 'single') {
        out.push({ severity: 'info', code: 'STEER_TYRES_NOT_SINGLE', message: `Steer axle on ${v.id} should use single tyres`, vehicleId: v.id });
      }
      if (!isSteer && a.count >= 2 && a.tyres === 'single') {
        out.push({ severity: 'info', code: 'DRIVE_TYRES_NOT_DUAL', message: `Multi-axle group on ${v.id} typically uses dual tyres`, vehicleId: v.id });
      }
    }
  }
  return out;
};

function limitForGroup(v: Vehicle, groupIndex: number): { limit: number; role: string } {
  const g = v.axles[groupIndex];
  const label = g.label?.toLowerCase() ?? '';
  const isSteer = label.includes('steer');
  const isDrive = label.includes('drive') || (v.kind === 'prime-mover' && !isSteer);
  if (isSteer && g.count === 1) return { limit: AXLE_GROUP_LIMITS.steerSingle, role: 'steer (single)' };
  if (isDrive) {
    if (g.count === 1) return { limit: AXLE_GROUP_LIMITS.singleDrive, role: 'single drive' };
    if (g.count === 2) return { limit: AXLE_GROUP_LIMITS.tandemDrive, role: 'tandem drive' };
    return { limit: AXLE_GROUP_LIMITS.triAxleDrive, role: 'tri-axle drive' };
  }
  if (g.count === 1) return { limit: AXLE_GROUP_LIMITS.singleTrailer, role: 'single trailer' };
  if (g.count === 2) return { limit: AXLE_GROUP_LIMITS.tandemTrailer, role: 'tandem trailer' };
  return { limit: AXLE_GROUP_LIMITS.triAxleTrailer, role: 'tri-axle trailer' };
}

const ruleAxleMassLimits: Rule = (c) => {
  const out: Finding[] = [];
  let report;
  try { report = computeLoad(c); } catch { return out; }
  for (const al of report.axleLoads) {
    const vehicle = c.vehicles.find((v) => v.id === al.vehicleId);
    if (!vehicle) continue;
    const { limit, role } = limitForGroup(vehicle, al.groupIndex);
    const tonnes = al.massKg / 1000;
    if (tonnes > limit + 0.01) {
      out.push({
        severity: 'warning',
        code: 'AXLE_MASS_EXCEEDED',
        message: `${vehicle.id} ${role} group ${tonnes.toFixed(2)} t exceeds ${limit.toFixed(1)} t`,
        vehicleId: vehicle.id,
      });
    }
  }
  return out;
};

const ruleOverallLength: Rule = (c, cls) => {
  const overall = computeOverallLength(c);
  if (cls === 'UNCLASSIFIED') {
    return [{ severity: 'info', code: 'UNCLASSIFIED', message: `Combination does not match a known NHVR class (${overall.toFixed(2)} m overall)` }];
  }
  const limit = CLASS_LENGTH_LIMITS[cls];
  if (overall > limit + 0.5) {
    return [{ severity: 'error', code: 'OVERALL_LENGTH_EXCEEDED', message: `Overall length ${overall.toFixed(2)} m exceeds ${cls} limit ${limit.toFixed(1)} m` }];
  }
  if (overall > limit) {
    return [{ severity: 'warning', code: 'OVERALL_LENGTH_BORDERLINE', message: `Overall length ${overall.toFixed(2)} m is over ${cls} limit ${limit.toFixed(1)} m by ${(overall - limit).toFixed(2)} m` }];
  }
  return [];
};

const RULES: Rule[] = [
  ruleDuplicateIds,
  ruleMinAxles,
  ruleFreightSlots,
  ruleCoupling,
  ruleDollyBetweenSemis,
  rulePrimeMoverAxles,
  ruleTyreStyles,
  ruleOverallLength,
  ruleAxleMassLimits,
];

export function validateCombination(c: Combination): ValidationReport {
  const cls = classifyCombination(c);
  const overallLengthM = computeOverallLength(c);
  const findings = RULES.flatMap((r) => r(c, cls));
  const summary = {
    errors: findings.filter((f) => f.severity === 'error').length,
    warnings: findings.filter((f) => f.severity === 'warning').length,
    infos: findings.filter((f) => f.severity === 'info').length,
  };
  return { overallLengthM, classMatched: cls === 'UNCLASSIFIED' ? null : cls, findings, summary };
}
