import { useMemo, useRef, useState } from 'react';
import TruckCombination from './TruckCombination';
import { presets } from './presets';
import { PBS_TEMPLATES } from './templates/pbs';
import Builder from './builder/Builder';
import ExportBar from './io/ExportBar';
import ComplianceReport from './compliance/ComplianceReport';
import { readCombinationFromLocation } from './io/exporters';
import { useCombinationUrlSync } from './io/useCombinationUrlSync';
import type { Combination } from './types';

type Tab = 'preview' | 'builder' | 'compliance';

const ALL_TEMPLATES: { group: 'Preset' | 'PBS'; combo: Combination }[] = [
  ...presets.map((p) => ({ group: 'Preset' as const, combo: p })),
  ...PBS_TEMPLATES.map((p) => ({ group: 'PBS' as const, combo: p })),
];

export default function App() {
  const [combination, setCombination] = useState<Combination>(() => {
    const fromUrl = readCombinationFromLocation();
    return fromUrl ?? presets[2];
  });
  const [tab, setTab] = useState<Tab>('preview');
  const [scale, setScale] = useState(26);
  const [annotations, setAnnotations] = useState(true);
  const [dims, setDims] = useState(true);
  const [measurements, setMeasurements] = useState(false);
  const [unload, setUnload] = useState(false);

  // Two-way URL sync
  useCombinationUrlSync(combination, (c) => setCombination(c));

  const svgRef = useRef<SVGSVGElement>(null);

  const displayCombination = useMemo(() => {
    if (!unload) return combination;
    return {
      ...combination,
      vehicles: combination.vehicles.map((v) => ({
        ...v,
        freightSlots: v.freightSlots?.map((s) => ({ ...s, loaded: false })),
      })),
    };
  }, [combination, unload]);

  const loadTemplate = (idx: number) => {
    if (idx < 0 || idx >= ALL_TEMPLATES.length) return;
    const clone = JSON.parse(JSON.stringify(ALL_TEMPLATES[idx].combo)) as Combination;
    setCombination(clone);
  };

  return (
    <div
      style={{
        fontFamily:
          'system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif',
        color: '#0f172a',
        minHeight: '100vh',
        background: '#f1f5f9',
        padding: '20px 18px 60px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <header style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ margin: 0, fontSize: 22, letterSpacing: -0.3 }}>
              SVG Truck &amp; Trailer Combination Generator
            </h1>
            <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 13, lineHeight: 1.5 }}>
              Data-driven Australian truck/trailer rendering · interactive builder · NHVR
              compliance · SVG/PNG/PDF export.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#e2e8f0', borderRadius: 8, padding: 4 }}>
            {(['preview', 'builder', 'compliance'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: '7px 14px',
                  fontSize: 13,
                  borderRadius: 6,
                  border: 'none',
                  background: tab === t ? '#0f172a' : 'transparent',
                  color: tab === t ? '#fff' : '#334155',
                  cursor: 'pointer',
                  fontWeight: tab === t ? 600 : 500,
                  textTransform: 'capitalize',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {/* Top controls */}
        <section
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 14,
            boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
            marginBottom: 12,
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <label style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 280 }}>
            <span style={{ color: '#475569', fontSize: 12 }}>Load template</span>
            <select
              onChange={(e) => loadTemplate(Number(e.target.value))}
              defaultValue=""
              style={{
                padding: '7px 9px',
                fontSize: 13,
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                background: '#fff',
              }}
            >
              <option value="" disabled>— Load a template (overwrites current) —</option>
              <optgroup label="Visual presets">
                {presets.map((p, i) => (
                  <option key={`p${i}`} value={i}>{p.name}</option>
                ))}
              </optgroup>
              <optgroup label="PBS / NHVR compliant">
                {PBS_TEMPLATES.map((p, i) => (
                  <option key={`pbs${i}`} value={presets.length + i}>{p.name}</option>
                ))}
              </optgroup>
            </select>
          </label>

          <label style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 180 }}>
            <span style={{ color: '#475569', fontSize: 12 }}>Scale ({scale} px / m)</span>
            <input
              type="range"
              min={14}
              max={48}
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
            />
          </label>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <Toggle label="Labels" checked={annotations} onChange={setAnnotations} />
            <Toggle label="Total length" checked={dims} onChange={setDims} />
            <Toggle label="Wheelbase rule" checked={measurements} onChange={setMeasurements} />
            <Toggle label="Unloaded view" checked={unload} onChange={setUnload} />
          </div>
        </section>

        {/* Export bar */}
        <section style={{ marginBottom: 12 }}>
          <ExportBar combination={combination} svgRef={svgRef} onImport={setCombination} />
        </section>

        {/* Main preview — always shown */}
        <section
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: 12,
            boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
            overflowX: 'auto',
          }}
        >
          <div style={{ marginBottom: 6, fontSize: 13, color: '#475569' }}>
            <strong style={{ color: '#0f172a', fontSize: 15 }}>{combination.name}</strong>
            {combination.description ? (
              <span style={{ marginLeft: 8 }}>— {combination.description}</span>
            ) : null}
          </div>
          <TruckCombination
            ref={svgRef}
            combination={displayCombination}
            scale={scale}
            showAnnotations={annotations}
            showDimensions={dims}
            showMeasurements={measurements}
          />
        </section>

        {/* Tab panel below */}
        {tab === 'builder' && (
          <section style={{ marginTop: 14 }}>
            <Builder combination={combination} onChange={setCombination} />
          </section>
        )}

        {tab === 'compliance' && (
          <section style={{ marginTop: 14 }}>
            <ComplianceReport combination={combination} />
          </section>
        )}

        {tab === 'preview' && (
          <details
            style={{
              marginTop: 14,
              background: '#fff',
              borderRadius: 12,
              padding: 14,
              boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
            }}
          >
            <summary style={{ cursor: 'pointer', fontSize: 14, color: '#1e293b' }}>
              Data model (JSON)
            </summary>
            <pre
              style={{
                marginTop: 12,
                fontSize: 12,
                background: '#0f172a',
                color: '#e2e8f0',
                padding: 12,
                borderRadius: 8,
                overflowX: 'auto',
                lineHeight: 1.45,
                maxHeight: 400,
              }}
            >
              {JSON.stringify(combination, null, 2)}
            </pre>
          </details>
        )}

        <footer style={{ marginTop: 28, fontSize: 12, color: '#64748b', lineHeight: 1.55 }}>
          <strong style={{ color: '#334155' }}>Programmatic usage</strong>
          <pre
            style={{
              background: '#0f172a',
              color: '#e2e8f0',
              padding: 12,
              borderRadius: 8,
              marginTop: 6,
              fontSize: 12,
              overflowX: 'auto',
            }}
          >{`import { TruckCombination } from './TruckCombination';
import { validateCombination } from './compliance/rules';
import { computeLoad } from './compliance/load';

const report = validateCombination(myCombination);
const load = computeLoad(myCombination);
<TruckCombination combination={myCombination} scale={26} showMeasurements />`}</pre>
          State syncs to the URL fragment automatically, so copying the browser URL shares the
          exact combination you see.
        </footer>
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

