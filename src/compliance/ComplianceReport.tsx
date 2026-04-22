import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Combination } from '../types';
import {
  validateCombination,
  type Finding,
  type NhvrClass,
  type Severity,
  CLASS_LENGTH_LIMITS,
  AXLE_GROUP_LIMITS,
} from './rules';
import { computeLoad } from './load';

interface ComplianceReportProps {
  combination: Combination;
}

const CLASS_LABELS: Record<NhvrClass, string> = {
  GENERAL_ACCESS_RIGID: 'General-Access Rigid',
  GENERAL_ACCESS_SEMI: 'General-Access Semi',
  TRUCK_AND_DOG: 'Truck & Dog',
  B_DOUBLE_GML: 'B-Double (GML)',
  B_DOUBLE_HML: 'B-Double (HML)',
  B_TRIPLE_PBS: 'B-Triple (PBS)',
  A_DOUBLE_PBS: 'A-Double (PBS)',
  ROAD_TRAIN_TYPE_1: 'Road Train — Type 1',
  ROAD_TRAIN_TYPE_2: 'Road Train — Type 2',
  UNCLASSIFIED: 'Unclassified',
};

const SEV_COLOR: Record<Severity, { bg: string; fg: string; border: string; icon: string }> = {
  ok: { bg: '#ecfdf5', fg: '#065f46', border: '#34d399', icon: '\u2713' },
  info: { bg: '#eff6ff', fg: '#1e40af', border: '#60a5fa', icon: '\u24D8' },
  warning: { bg: '#fffbeb', fg: '#92400e', border: '#f59e0b', icon: '\u26A0' },
  error: { bg: '#fef2f2', fg: '#991b1b', border: '#ef4444', icon: '\u2717' },
};

const card: CSSProperties = {
  background: '#fff',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
};

function SeverityIcon({ sev }: { sev: Severity }) {
  const c = SEV_COLOR[sev];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: c.bg,
        color: c.fg,
        border: `1px solid ${c.border}`,
        fontSize: 12,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {c.icon}
    </span>
  );
}

function FindingRow({ f }: { f: Finding }) {
  const c = SEV_COLOR[f.severity];
  return (
    <div
      style={{
        display: 'flex',
        gap: 10,
        padding: '8px 10px',
        borderRadius: 8,
        background: c.bg,
        border: `1px solid ${c.border}30`,
        marginBottom: 6,
      }}
    >
      <SeverityIcon sev={f.severity} />
      <div style={{ fontSize: 13, color: '#0f172a', lineHeight: 1.4 }}>
        <div>
          <code style={{ fontSize: 11, color: c.fg, background: '#fff', padding: '1px 6px', borderRadius: 4, marginRight: 6 }}>
            {f.code}
          </code>
          {f.message}
          {f.vehicleId ? <span style={{ color: '#64748b' }}> — {f.vehicleId}</span> : null}
        </div>
        {f.detail ? <div style={{ color: '#475569', fontSize: 12, marginTop: 2 }}>{f.detail}</div> : null}
      </div>
    </div>
  );
}

function groupLimit(label: string | undefined, count: number, vehicleKind: string): { limit: number; role: string } {
  const l = label?.toLowerCase() ?? '';
  if (l.includes('steer')) return { limit: AXLE_GROUP_LIMITS.steerSingle, role: 'steer' };
  if (l.includes('drive') || vehicleKind === 'prime-mover') {
    if (count === 1) return { limit: AXLE_GROUP_LIMITS.singleDrive, role: 'single drive' };
    if (count === 2) return { limit: AXLE_GROUP_LIMITS.tandemDrive, role: 'tandem drive' };
    return { limit: AXLE_GROUP_LIMITS.triAxleDrive, role: 'tri-axle drive' };
  }
  if (count === 1) return { limit: AXLE_GROUP_LIMITS.singleTrailer, role: 'single' };
  if (count === 2) return { limit: AXLE_GROUP_LIMITS.tandemTrailer, role: 'tandem' };
  return { limit: AXLE_GROUP_LIMITS.triAxleTrailer, role: 'tri-axle' };
}

export default function ComplianceReport({ combination }: ComplianceReportProps) {
  const report = useMemo(() => validateCombination(combination), [combination]);
  const load = useMemo(() => computeLoad(combination), [combination]);

  const cls = report.classMatched;
  const classLabel = cls ? CLASS_LABELS[cls] : CLASS_LABELS.UNCLASSIFIED;
  const classLimit = cls ? CLASS_LENGTH_LIMITS[cls] : null;
  const overOk = classLimit == null ? true : report.overallLengthM <= classLimit + 0.01;

  const bySeverity: Record<Severity, Finding[]> = {
    error: [],
    warning: [],
    info: [],
    ok: [],
  };
  for (const f of report.findings) bySeverity[f.severity].push(f);

  const hasAny = report.findings.length > 0;

  return (
    <section style={{ ...card, marginTop: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>Compliance Check</h2>
        <span
          style={{
            fontSize: 12,
            padding: '3px 10px',
            borderRadius: 999,
            background: cls ? '#0f172a' : '#e2e8f0',
            color: cls ? '#fff' : '#334155',
            fontWeight: 600,
          }}
        >
          {classLabel}
        </span>
        <span
          style={{
            fontSize: 12,
            padding: '3px 10px',
            borderRadius: 999,
            background: overOk ? '#ecfdf5' : '#fef2f2',
            color: overOk ? '#065f46' : '#991b1b',
            border: `1px solid ${overOk ? '#34d399' : '#ef4444'}`,
            fontWeight: 600,
          }}
        >
          Overall {report.overallLengthM.toFixed(2)} m
          {classLimit != null ? ` / ${classLimit.toFixed(1)} m` : ''}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748b' }}>
          {report.summary.errors} errors · {report.summary.warnings} warnings · {report.summary.infos} info
        </span>
      </header>

      <div style={{ marginBottom: 14 }}>
        {!hasAny ? (
          <FindingRow f={{ severity: 'ok', code: 'ALL_CLEAR', message: 'No compliance issues detected.' }} />
        ) : (
          (['error', 'warning', 'info'] as Severity[]).flatMap((s) =>
            bySeverity[s].map((f, i) => <FindingRow key={`${s}-${i}`} f={f} />),
          )
        )}
      </div>

      <h3 style={{ fontSize: 14, margin: '6px 0 8px', color: '#0f172a' }}>Axle Group Loads</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '6px 8px' }}>Vehicle</th>
              <th style={{ padding: '6px 8px' }}>Group</th>
              <th style={{ padding: '6px 8px' }}>Pos (m)</th>
              <th style={{ padding: '6px 8px' }}>Axles</th>
              <th style={{ padding: '6px 8px' }}>Mass (t)</th>
              <th style={{ padding: '6px 8px' }}>Limit (t)</th>
              <th style={{ padding: '6px 8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {load.axleLoads.map((al, i) => {
              const v = combination.vehicles.find((x) => x.id === al.vehicleId);
              const grp = v?.axles[al.groupIndex];
              const { limit, role } = groupLimit(grp?.label, al.axleCount, v?.kind ?? '');
              const t = al.massKg / 1000;
              const pass = t <= limit + 0.01;
              return (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 600 }}>{al.vehicleId}</td>
                  <td style={{ padding: '6px 8px', color: '#475569' }}>{grp?.label ?? role}</td>
                  <td style={{ padding: '6px 8px' }}>{al.positionM.toFixed(2)}</td>
                  <td style={{ padding: '6px 8px' }}>{al.axleCount}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 600 }}>{t.toFixed(2)}</td>
                  <td style={{ padding: '6px 8px', color: '#475569' }}>{limit.toFixed(1)}</td>
                  <td style={{ padding: '6px 8px' }}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: pass ? '#ecfdf5' : '#fef2f2',
                        color: pass ? '#065f46' : '#991b1b',
                        border: `1px solid ${pass ? '#34d399' : '#ef4444'}`,
                        fontWeight: 600,
                      }}
                    >
                      {pass ? 'OK' : 'OVER'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: 12,
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 14px',
          background: '#0f172a',
          color: '#f1f5f9',
          borderRadius: 10,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <span>Combination gross mass</span>
        <span>{(load.combinationGrossMassKg / 1000).toFixed(2)} t</span>
      </div>
    </section>
  );
}
