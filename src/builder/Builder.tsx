import React, { useEffect, useState } from 'react';
import type { Combination, Vehicle, VehicleKind } from '../types';
import VehicleEditor, { makeDefaultVehicle } from './VehicleEditor';

interface BuilderProps {
  combination: Combination;
  onChange: (next: Combination) => void;
}

const VEHICLE_KINDS: VehicleKind[] = [
  'prime-mover',
  'rigid',
  'semi-trailer',
  'a-trailer',
  'b-trailer',
  'dog-trailer',
  'pig-trailer',
  'dolly',
];

const panelStyle: React.CSSProperties = {
  background: '#f1f5f9',
  padding: 12,
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
  fontSize: 13,
  color: '#0f172a',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(15,23,42,0.08)',
  overflow: 'hidden',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 12px',
  cursor: 'pointer',
  userSelect: 'none',
  background: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
};

const inputStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  padding: '6px 8px',
  borderRadius: 6,
  fontSize: 13,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  width: '100%',
};

const smallBtnStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  background: '#fff',
  borderRadius: 6,
  padding: '4px 8px',
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const deleteBtnStyle: React.CSSProperties = {
  ...smallBtnStyle,
  color: '#b91c1c',
  borderColor: '#fecaca',
};

const primaryBtnStyle: React.CSSProperties = {
  ...smallBtnStyle,
  background: '#0f172a',
  color: '#fff',
  borderColor: '#0f172a',
};

const badgeStyle: React.CSSProperties = {
  fontSize: 11,
  background: '#e0e7ff',
  color: '#3730a3',
  padding: '2px 6px',
  borderRadius: 999,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  fontWeight: 600,
};

const Builder: React.FC<BuilderProps> = ({ combination, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    combination.vehicles[combination.vehicles.length - 1]?.id ?? null,
  );
  const [lastCombinationName, setLastCombinationName] = useState(combination.name);

  // When combination name changes (i.e. a preset is loaded) collapse all.
  useEffect(() => {
    if (combination.name !== lastCombinationName) {
      setLastCombinationName(combination.name);
      setExpandedId(null);
    }
  }, [combination.name, lastCombinationName]);

  const updateVehicle = (idx: number, v: Vehicle) => {
    const vehicles = combination.vehicles.map((x, i) => (i === idx ? v : x));
    onChange({ ...combination, vehicles });
  };

  const removeVehicle = (idx: number) => {
    const vehicles = combination.vehicles.filter((_, i) => i !== idx);
    onChange({ ...combination, vehicles });
  };

  const moveVehicle = (idx: number, delta: number) => {
    const target = idx + delta;
    if (target < 0 || target >= combination.vehicles.length) return;
    const vehicles = combination.vehicles.slice();
    const [v] = vehicles.splice(idx, 1);
    vehicles.splice(target, 0, v);
    onChange({ ...combination, vehicles });
  };

  const addVehicle = (kind: VehicleKind) => {
    const v = makeDefaultVehicle(kind);
    onChange({ ...combination, vehicles: [...combination.vehicles, v] });
    setExpandedId(v.id);
  };

  return (
    <div style={panelStyle}>
      <div style={{ ...cardStyle, padding: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label
            style={{
              fontSize: 12,
              color: '#334155',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            Combination name
            <input
              type="text"
              value={combination.name}
              onChange={(e) => onChange({ ...combination, name: e.target.value })}
              style={inputStyle}
            />
          </label>
          <label
            style={{
              fontSize: 12,
              color: '#334155',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            Description
            <textarea
              value={combination.description ?? ''}
              onChange={(e) =>
                onChange({ ...combination, description: e.target.value || undefined })
              }
              style={{ ...inputStyle, minHeight: 48, resize: 'vertical' }}
            />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {combination.vehicles.length === 0 && (
          <div
            style={{
              ...cardStyle,
              padding: 20,
              textAlign: 'center',
              color: '#64748b',
              fontStyle: 'italic',
            }}
          >
            No vehicles yet. Add one using the buttons below.
          </div>
        )}

        {combination.vehicles.map((vehicle, idx) => {
          const expanded = expandedId === vehicle.id;
          return (
            <div key={vehicle.id} style={cardStyle}>
              <div
                style={cardHeaderStyle}
                onClick={() => setExpandedId(expanded ? null : vehicle.id)}
              >
                <span style={{ fontSize: 12, color: '#94a3b8', width: 16 }}>
                  {expanded ? '▼' : '▶'}
                </span>
                <span style={{ fontWeight: 600 }}>
                  {vehicle.label || `Vehicle ${idx + 1}`}
                </span>
                <span style={badgeStyle}>{vehicle.kind}</span>
                <span style={{ flex: 1 }} />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveVehicle(idx, -1);
                  }}
                  disabled={idx === 0}
                  style={{
                    ...smallBtnStyle,
                    opacity: idx === 0 ? 0.4 : 1,
                    cursor: idx === 0 ? 'not-allowed' : 'pointer',
                  }}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    moveVehicle(idx, 1);
                  }}
                  disabled={idx === combination.vehicles.length - 1}
                  style={{
                    ...smallBtnStyle,
                    opacity: idx === combination.vehicles.length - 1 ? 0.4 : 1,
                    cursor:
                      idx === combination.vehicles.length - 1
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVehicle(idx);
                  }}
                  style={deleteBtnStyle}
                  title="Delete vehicle"
                >
                  Delete
                </button>
              </div>
              {expanded && (
                <div style={{ padding: 12 }}>
                  <VehicleEditor
                    vehicle={vehicle}
                    onChange={(v) => updateVehicle(idx, v)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          ...cardStyle,
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
          Add vehicle
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {VEHICLE_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => addVehicle(k)}
              style={primaryBtnStyle}
            >
              + {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Builder;
