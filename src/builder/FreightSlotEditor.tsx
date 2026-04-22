import React from 'react';
import type { FreightSlot, FreightType } from '../types';
import { FREIGHT_COMPONENTS } from '../freight';

interface FreightSlotEditorProps {
  slots: FreightSlot[];
  onChange: (slots: FreightSlot[]) => void;
}

const FREIGHT_TYPES = Object.keys(FREIGHT_COMPONENTS) as FreightType[];

const inputStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  padding: '6px 8px',
  borderRadius: 6,
  fontSize: 13,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
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

const addBtnStyle: React.CSSProperties = {
  ...smallBtnStyle,
  background: '#0f172a',
  color: '#fff',
  borderColor: '#0f172a',
};

const FreightSlotEditor: React.FC<FreightSlotEditorProps> = ({ slots, onChange }) => {
  const updateSlot = (idx: number, patch: Partial<FreightSlot>) => {
    const next = slots.map((s, i) => (i === idx ? { ...s, ...patch } : s));
    onChange(next);
  };

  const removeSlot = (idx: number) => {
    onChange(slots.filter((_, i) => i !== idx));
  };

  const addSlot = () => {
    const last = slots[slots.length - 1];
    const start = last ? +(last.start + last.length + 0.2).toFixed(2) : 1.0;
    onChange([
      ...slots,
      { start, length: 3.0, label: `S${slots.length + 1}`, loaded: false },
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {slots.length === 0 && (
        <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
          No freight slots.
        </div>
      )}
      {slots.map((slot, idx) => (
        <div
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '70px 70px 1fr 70px 1fr 32px',
            gap: 6,
            alignItems: 'center',
          }}
        >
          <input
            type="number"
            step={0.1}
            value={slot.start}
            onChange={(e) => updateSlot(idx, { start: parseFloat(e.target.value) || 0 })}
            style={inputStyle}
            title="start (m)"
          />
          <input
            type="number"
            step={0.1}
            value={slot.length}
            onChange={(e) => updateSlot(idx, { length: parseFloat(e.target.value) || 0 })}
            style={inputStyle}
            title="length (m)"
          />
          <input
            type="text"
            value={slot.label ?? ''}
            onChange={(e) => updateSlot(idx, { label: e.target.value || undefined })}
            placeholder="label"
            style={inputStyle}
          />
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              color: '#334155',
            }}
          >
            <input
              type="checkbox"
              checked={!!slot.loaded}
              onChange={(e) => updateSlot(idx, { loaded: e.target.checked })}
            />
            loaded
          </label>
          <select
            value={slot.loadType ?? ''}
            onChange={(e) =>
              updateSlot(idx, {
                loadType: (e.target.value || undefined) as FreightType | undefined,
              })
            }
            style={inputStyle}
          >
            <option value="">(none)</option>
            {FREIGHT_TYPES.map((ft) => (
              <option key={ft} value={ft}>
                {ft}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => removeSlot(idx)}
            style={deleteBtnStyle}
            title="Remove slot"
          >
            X
          </button>
        </div>
      ))}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '70px 70px 1fr 70px 1fr 32px',
          gap: 6,
          fontSize: 11,
          color: '#64748b',
          paddingLeft: 2,
        }}
      >
        <span>start (m)</span>
        <span>length (m)</span>
        <span>label</span>
        <span>loaded</span>
        <span>load type</span>
        <span></span>
      </div>
      <div>
        <button type="button" onClick={addSlot} style={addBtnStyle}>
          + Add freight slot
        </button>
      </div>
    </div>
  );
};

export default FreightSlotEditor;
