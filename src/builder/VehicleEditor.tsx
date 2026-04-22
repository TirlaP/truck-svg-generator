import React, { useState } from 'react';
import type {
  AttachmentKind,
  AxleGroup,
  Attachment,
  BodyType,
  CabType,
  Vehicle,
  VehicleKind,
} from '../types';
import { BODY_COMPONENTS } from '../bodies';
import { CAB_COMPONENTS, CAB_DEFAULT_LENGTH } from '../cabs';
import FreightSlotEditor from './FreightSlotEditor';

interface VehicleEditorProps {
  vehicle: Vehicle;
  onChange: (v: Vehicle) => void;
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

const ATTACHMENT_KINDS: AttachmentKind[] = [
  'kingpin',
  'turntable',
  'drawbar-eye',
  'drawbar-hitch',
];

const CAB_TYPES = Object.keys(CAB_COMPONENTS) as CabType[];
const BODY_TYPES = Object.keys(BODY_COMPONENTS) as BodyType[];

const inputStyle: React.CSSProperties = {
  border: '1px solid #cbd5e1',
  padding: '6px 8px',
  borderRadius: 6,
  fontSize: 13,
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#334155',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#0f172a',
  textTransform: 'uppercase',
  letterSpacing: 0.4,
  marginTop: 8,
  marginBottom: 4,
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

// Defaults by kind — mirrors src/presets.ts
export function makeDefaultVehicle(kind: VehicleKind): Vehicle {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `v-${Math.random().toString(36).slice(2, 10)}`;
  switch (kind) {
    case 'prime-mover':
      return {
        id,
        kind,
        length: 6.9,
        cabType: 'bonneted-sleeper',
        axles: [
          { count: 1, position: 1.4, tyres: 'single', label: 'steer' },
          { count: 2, position: 5.4, spacing: 1.35, tyres: 'dual', label: 'drive' },
        ],
        attachments: [{ kind: 'turntable', position: 5.1 }],
        label: 'Prime Mover',
      };
    case 'rigid':
      return {
        id,
        kind,
        length: 10.5,
        cabType: 'light-cab-over',
        bodyType: 'box-van',
        cabLength: 2.6,
        axles: [
          { count: 1, position: 1.5, tyres: 'single', label: 'steer' },
          { count: 2, position: 8.2, spacing: 1.3, tyres: 'dual', label: 'drive' },
        ],
        attachments: [],
        freightSlots: [],
        label: 'Rigid',
      };
    case 'semi-trailer':
      return {
        id,
        kind,
        length: 13.7,
        bodyType: 'curtain-sider',
        axles: [{ count: 3, position: 12.1, spacing: 1.35, tyres: 'dual', label: 'tri' }],
        attachments: [{ kind: 'kingpin', position: 1.2 }],
        freightSlots: [],
        label: 'Semi-Trailer',
      };
    case 'a-trailer':
      return {
        id,
        kind,
        length: 9.0,
        bodyType: 'curtain-sider',
        axles: [{ count: 2, position: 6.9, spacing: 1.35, tyres: 'dual', label: 'tandem' }],
        attachments: [
          { kind: 'kingpin', position: 1.2 },
          { kind: 'turntable', position: 8.3 },
        ],
        freightSlots: [],
        label: 'A-Trailer',
      };
    case 'b-trailer':
      return {
        id,
        kind,
        length: 11.5,
        bodyType: 'curtain-sider',
        axles: [{ count: 2, position: 9.8, spacing: 1.35, tyres: 'dual', label: 'tandem' }],
        attachments: [{ kind: 'kingpin', position: 0.9 }],
        freightSlots: [],
        label: 'B-Trailer',
      };
    case 'dog-trailer':
      return {
        id,
        kind,
        length: 8.0,
        bodyType: 'box-van',
        axles: [
          { count: 1, position: 0.9, tyres: 'dual' },
          { count: 1, position: 6.9, tyres: 'dual' },
        ],
        attachments: [{ kind: 'drawbar-eye', position: 0 }],
        freightSlots: [],
        label: 'Dog Trailer',
      };
    case 'pig-trailer':
      return {
        id,
        kind,
        length: 7.5,
        bodyType: 'box-van',
        axles: [{ count: 2, position: 4.2, spacing: 1.35, tyres: 'dual', label: 'tandem' }],
        attachments: [{ kind: 'drawbar-eye', position: 0 }],
        freightSlots: [],
        label: 'Pig Trailer',
      };
    case 'dolly':
      return {
        id,
        kind,
        length: 3.3,
        axles: [{ count: 2, position: 2.3, spacing: 1.35, tyres: 'dual' }],
        attachments: [
          { kind: 'drawbar-eye', position: 0 },
          { kind: 'turntable', position: 2.5 },
        ],
        label: 'Dolly',
      };
  }
}

const VehicleEditor: React.FC<VehicleEditorProps> = ({ vehicle, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const patch = (p: Partial<Vehicle>) => onChange({ ...vehicle, ...p });

  const showCab = vehicle.kind === 'prime-mover' || vehicle.kind === 'rigid';
  const showBody =
    vehicle.kind === 'rigid' ||
    vehicle.kind === 'semi-trailer' ||
    vehicle.kind === 'a-trailer' ||
    vehicle.kind === 'b-trailer' ||
    vehicle.kind === 'dog-trailer' ||
    vehicle.kind === 'pig-trailer';
  const showCabLength = vehicle.kind === 'rigid';
  const showFreight = showBody;

  const handleKindChange = (newKind: VehicleKind) => {
    if (newKind === vehicle.kind) return;
    const defaults = makeDefaultVehicle(newKind);
    onChange({
      ...defaults,
      id: vehicle.id,
      label: vehicle.label,
      bodyColor: vehicle.bodyColor,
      cabColor: vehicle.cabColor,
    });
  };

  // ---- Axles ----
  const updateAxle = (idx: number, p: Partial<AxleGroup>) => {
    const next = vehicle.axles.map((a, i) => (i === idx ? { ...a, ...p } : a));
    patch({ axles: next });
  };
  const removeAxle = (idx: number) =>
    patch({ axles: vehicle.axles.filter((_, i) => i !== idx) });
  const addAxle = () => {
    const last = vehicle.axles[vehicle.axles.length - 1];
    const position = last ? +(last.position + 1.5).toFixed(2) : 1.5;
    patch({
      axles: [...vehicle.axles, { count: 1, position, spacing: 1.3, tyres: 'dual' }],
    });
  };

  // ---- Attachments ----
  const attachments = vehicle.attachments ?? [];
  const updateAttachment = (idx: number, p: Partial<Attachment>) => {
    const next = attachments.map((a, i) => (i === idx ? { ...a, ...p } : a));
    patch({ attachments: next });
  };
  const removeAttachment = (idx: number) =>
    patch({ attachments: attachments.filter((_, i) => i !== idx) });
  const addAttachment = () =>
    patch({
      attachments: [...attachments, { kind: 'kingpin', position: 1.0 }],
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
        }}
      >
        <label style={labelStyle}>
          Label
          <input
            type="text"
            value={vehicle.label ?? ''}
            onChange={(e) => patch({ label: e.target.value || undefined })}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          Kind
          <select
            value={vehicle.kind}
            onChange={(e) => handleKindChange(e.target.value as VehicleKind)}
            style={inputStyle}
          >
            {VEHICLE_KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          Length (m)
          <input
            type="number"
            step={0.1}
            value={vehicle.length}
            onChange={(e) => patch({ length: parseFloat(e.target.value) || 0 })}
            style={inputStyle}
          />
        </label>
        {showCab && (
          <label style={labelStyle}>
            Cab type
            <select
              value={vehicle.cabType ?? ''}
              onChange={(e) =>
                patch({
                  cabType: (e.target.value || undefined) as CabType | undefined,
                  cabLength:
                    vehicle.kind === 'rigid' && e.target.value
                      ? CAB_DEFAULT_LENGTH[e.target.value as CabType]
                      : vehicle.cabLength,
                })
              }
              style={inputStyle}
            >
              {CAB_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
        {showCabLength && (
          <label style={labelStyle}>
            Cab length (m)
            <input
              type="number"
              step={0.1}
              value={vehicle.cabLength ?? 0}
              onChange={(e) => patch({ cabLength: parseFloat(e.target.value) || 0 })}
              style={inputStyle}
            />
          </label>
        )}
        {showBody && (
          <label style={labelStyle}>
            Body type
            <select
              value={vehicle.bodyType ?? ''}
              onChange={(e) =>
                patch({ bodyType: (e.target.value || undefined) as BodyType | undefined })
              }
              style={inputStyle}
            >
              {BODY_TYPES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </label>
        )}
        {showCab && (
          <label style={labelStyle}>
            Cab color
            <input
              type="color"
              value={vehicle.cabColor ?? '#cbd5e1'}
              onChange={(e) => patch({ cabColor: e.target.value })}
              style={{ ...inputStyle, padding: 2, height: 32 }}
            />
          </label>
        )}
        {showBody && (
          <label style={labelStyle}>
            Body color
            <input
              type="color"
              value={vehicle.bodyColor ?? '#cbd5e1'}
              onChange={(e) => patch({ bodyColor: e.target.value })}
              style={{ ...inputStyle, padding: 2, height: 32 }}
            />
          </label>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((s) => !s)}
          style={smallBtnStyle}
        >
          {showAdvanced ? '– Advanced' : '+ Advanced'}
        </button>
        {showAdvanced && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 8,
              marginTop: 8,
            }}
          >
            <label style={labelStyle}>
              Deck height (m)
              <input
                type="number"
                step={0.05}
                value={vehicle.deckHeight ?? ''}
                onChange={(e) =>
                  patch({
                    deckHeight: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              Body height (m)
              <input
                type="number"
                step={0.05}
                value={vehicle.bodyHeight ?? ''}
                onChange={(e) =>
                  patch({
                    bodyHeight: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                style={inputStyle}
              />
            </label>
          </div>
        )}
      </div>

      <div>
        <div style={sectionTitleStyle}>Axles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {vehicle.axles.map((axle, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '60px 70px 70px 80px 1fr 32px',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <input
                type="number"
                min={1}
                max={3}
                step={1}
                value={axle.count}
                onChange={(e) =>
                  updateAxle(idx, { count: parseInt(e.target.value, 10) || 1 })
                }
                style={inputStyle}
                title="count"
              />
              <input
                type="number"
                step={0.1}
                value={axle.position}
                onChange={(e) =>
                  updateAxle(idx, { position: parseFloat(e.target.value) || 0 })
                }
                style={inputStyle}
                title="position (m)"
              />
              <input
                type="number"
                step={0.05}
                value={axle.spacing ?? 1.3}
                onChange={(e) =>
                  updateAxle(idx, { spacing: parseFloat(e.target.value) || 0 })
                }
                style={inputStyle}
                title="spacing (m)"
              />
              <select
                value={axle.tyres ?? 'dual'}
                onChange={(e) =>
                  updateAxle(idx, { tyres: e.target.value as 'single' | 'dual' })
                }
                style={inputStyle}
              >
                <option value="single">single</option>
                <option value="dual">dual</option>
              </select>
              <input
                type="text"
                value={axle.label ?? ''}
                placeholder="label"
                onChange={(e) =>
                  updateAxle(idx, { label: e.target.value || undefined })
                }
                style={inputStyle}
              />
              <button
                type="button"
                onClick={() => removeAxle(idx)}
                style={deleteBtnStyle}
              >
                X
              </button>
            </div>
          ))}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 70px 70px 80px 1fr 32px',
              gap: 6,
              fontSize: 11,
              color: '#64748b',
              paddingLeft: 2,
            }}
          >
            <span>count</span>
            <span>pos (m)</span>
            <span>spacing</span>
            <span>tyres</span>
            <span>label</span>
            <span></span>
          </div>
          <div>
            <button type="button" onClick={addAxle} style={addBtnStyle}>
              + Add axle group
            </button>
          </div>
        </div>
      </div>

      <div>
        <div style={sectionTitleStyle}>Attachments</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {attachments.length === 0 && (
            <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic' }}>
              No attachments.
            </div>
          )}
          {attachments.map((att, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 100px 32px',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <select
                value={att.kind}
                onChange={(e) =>
                  updateAttachment(idx, { kind: e.target.value as AttachmentKind })
                }
                style={inputStyle}
              >
                {ATTACHMENT_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <input
                type="number"
                step={0.1}
                value={att.position}
                onChange={(e) =>
                  updateAttachment(idx, { position: parseFloat(e.target.value) || 0 })
                }
                style={inputStyle}
                title="position (m)"
              />
              <button
                type="button"
                onClick={() => removeAttachment(idx)}
                style={deleteBtnStyle}
              >
                X
              </button>
            </div>
          ))}
          <div>
            <button type="button" onClick={addAttachment} style={addBtnStyle}>
              + Add attachment
            </button>
          </div>
        </div>
      </div>

      {showFreight && (
        <div>
          <div style={sectionTitleStyle}>Freight slots</div>
          <FreightSlotEditor
            slots={vehicle.freightSlots ?? []}
            onChange={(slots) => patch({ freightSlots: slots })}
          />
        </div>
      )}
    </div>
  );
};

export default VehicleEditor;
