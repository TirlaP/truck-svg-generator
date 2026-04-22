import { forwardRef, useMemo } from 'react';
import type {
  Attachment,
  AttachmentKind,
  Combination,
  FreightSlot,
  Vehicle,
} from './types';
import { palette } from './kit/palette';
import {
  DrawbarEye,
  DrawbarHitch,
  GroundShadow,
  KingpinMarker,
  MudFlap,
  TractorChassis,
  TurntableMarker,
  WHEEL_RADIUS_M,
  Wheels,
} from './kit/primitives';
import { BODY_COMPONENTS, BODY_DEFAULTS } from './bodies';
import { CAB_COMPONENTS, CAB_DEFAULT_LENGTH, CAB_HEIGHT } from './cabs';
import { FREIGHT_COMPONENTS, FREIGHT_DIMENSIONS } from './freight';

interface Props {
  combination: Combination;
  /** Pixels per metre. Default 26. The SVG scales via viewBox regardless. */
  scale?: number;
  showAnnotations?: boolean;
  showDimensions?: boolean;
  /** Draw per-vehicle wheelbase and kingpin-to-rear-axle measurements. */
  showMeasurements?: boolean;
  /** Highlight a vehicle by id (e.g. from the builder's selection). */
  highlightId?: string | null;
  /** Fixed SVG height in px. Width auto-fits combination length. */
  height?: number;
  /** Background style. */
  background?: 'sky' | 'plain' | 'none';
  className?: string;
  style?: React.CSSProperties;
}

// ---------- Layout: place each vehicle along x by matching attachments ----------

interface Placed {
  v: Vehicle;
  /** World x (m) of this vehicle's front. */
  x0: number;
}

function attOf(v: Vehicle, kinds: AttachmentKind[]): Attachment | undefined {
  return v.attachments?.find((a) => kinds.includes(a.kind));
}

function connection(prev: Vehicle, curr: Vehicle) {
  const pin = attOf(curr, ['kingpin']);
  const tt = attOf(prev, ['turntable']);
  if (pin && tt) return { prevAt: tt.position, currAt: pin.position, gap: 0 };

  const eye = attOf(curr, ['drawbar-eye']);
  const hitch = attOf(prev, ['drawbar-hitch']);
  if (eye && hitch) return { prevAt: hitch.position, currAt: eye.position, gap: 0.7 };

  return null;
}

function layout(combination: Combination): { placed: Placed[]; totalLength: number } {
  const placed: Placed[] = [];
  let rearmost = 0;
  combination.vehicles.forEach((v, i) => {
    if (i === 0) {
      placed.push({ v, x0: 0 });
      rearmost = v.length;
      return;
    }
    const prev = placed[i - 1];
    const conn = connection(prev.v, v);
    const x0 = conn
      ? prev.x0 + conn.prevAt - conn.currAt + conn.gap
      : rearmost + 0.3;
    placed.push({ v, x0 });
    rearmost = Math.max(rearmost, x0 + v.length);
  });
  return { placed, totalLength: rearmost };
}

// ---------- Geometry defaults per kind ----------

function defaultDeckHeight(v: Vehicle): number {
  if (v.deckHeight != null) return v.deckHeight;
  if (v.kind === 'prime-mover') return 1.15;
  if (v.kind === 'dolly') return 1.0;
  if (v.bodyType) return BODY_DEFAULTS[v.bodyType].deckHeight;
  return 1.3;
}

function defaultTopHeight(v: Vehicle): number {
  if (v.bodyHeight != null) return v.bodyHeight;
  if (v.kind === 'prime-mover') {
    return v.cabType ? CAB_HEIGHT[v.cabType] : 3.7;
  }
  if (v.kind === 'dolly') return 1.3;
  if (v.bodyType) return BODY_DEFAULTS[v.bodyType].topHeight;
  return 3.9;
}

function defaultCabLength(v: Vehicle): number {
  if (v.cabLength != null) return v.cabLength;
  if (v.cabType) return CAB_DEFAULT_LENGTH[v.cabType];
  return v.kind === 'rigid' ? 3.4 : 2.6;
}

// ---------- Dolly (inline — simple frame) ----------

function DollyShape({ v, scale }: { v: Vehicle; scale: number }) {
  const L = v.length * scale;
  const deck = defaultDeckHeight(v);
  return (
    <g>
      {/* Drawbar */}
      <line
        x1={0}
        y1={-deck * scale * 0.55}
        x2={1.3 * scale}
        y2={-deck * scale + 2}
        stroke={palette.chassis}
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* Frame */}
      <rect
        x={1.2 * scale}
        y={-deck * scale + 2}
        width={L - 1.2 * scale}
        height={4}
        fill={palette.chassis}
      />
      {/* Platform */}
      <rect
        x={1.3 * scale}
        y={-deck * scale}
        width={L - 1.5 * scale}
        height={deck * scale - WHEEL_RADIUS_M * scale - 4}
        fill={palette.chassisLight}
        stroke={palette.chassis}
        strokeWidth={0.8}
        rx={1}
      />
    </g>
  );
}

// ---------- Freight rendering on a slot ----------

function FreightOnSlot({
  slot,
  scale,
  deckHeight,
}: {
  slot: FreightSlot;
  scale: number;
  deckHeight: number;
}) {
  if (!slot.loaded || !slot.loadType) return null;
  const Comp = FREIGHT_COMPONENTS[slot.loadType];
  const natural = FREIGHT_DIMENSIONS[slot.loadType].length;
  const available = slot.length;
  const effective = Math.min(natural, available);
  const offsetX = (slot.start + (available - effective) / 2) * scale;
  return (
    <g transform={`translate(${offsetX}, ${-deckHeight * scale})`}>
      <Comp scale={scale} length={effective} deckHeight={deckHeight} label={slot.label} />
    </g>
  );
}

// ---------- Per-vehicle rendering ----------

function Axles({ vehicle, scale }: { vehicle: Vehicle; scale: number }) {
  const deck = defaultDeckHeight(vehicle);
  return (
    <g>
      {vehicle.axles.map((g, i) => (
        <g key={i} transform={`translate(${g.position * scale}, 0)`}>
          <Wheels group={g} scale={scale} suspensionTop={deck - 0.05} />
        </g>
      ))}
    </g>
  );
}

function Attachments({ vehicle, scale }: { vehicle: Vehicle; scale: number }) {
  const deck = defaultDeckHeight(vehicle);
  return (
    <g>
      {(vehicle.attachments ?? []).map((a, i) => {
        const x = a.position * scale;
        const deckY = -deck * scale;
        switch (a.kind) {
          case 'kingpin':
            return <KingpinMarker key={i} x={x} deckY={deckY} />;
          case 'turntable':
            return <TurntableMarker key={i} x={x} deckY={deckY} />;
          case 'drawbar-eye':
            return <DrawbarEye key={i} x={x} deckHeight={deck} scale={scale} />;
          case 'drawbar-hitch':
            return <DrawbarHitch key={i} x={x} deckHeight={deck} scale={scale} />;
          default:
            return null;
        }
      })}
    </g>
  );
}

function VehicleRender({ vehicle, scale }: { vehicle: Vehicle; scale: number }) {
  const deck = defaultDeckHeight(vehicle);
  const top = defaultTopHeight(vehicle);

  const renderShell = () => {
    if (vehicle.kind === 'dolly') {
      return <DollyShape v={vehicle} scale={scale} />;
    }

    if (vehicle.kind === 'prime-mover') {
      const cabType = vehicle.cabType ?? 'bonneted-sleeper';
      const Cab = CAB_COMPONENTS[cabType];
      const cabLen = defaultCabLength(vehicle);
      return (
        <g>
          {/* Chassis tail behind the cab (fuel tanks, frame) */}
          <TractorChassis
            startX={cabLen * scale}
            endX={vehicle.length * scale}
            scale={scale}
            deckHeight={deck}
          />
          <Cab
            scale={scale}
            cabLength={cabLen}
            mode="prime-mover"
            color={vehicle.cabColor}
          />
          {/* Rear mud flap behind drive axles */}
          <MudFlap scale={scale} deckHeight={deck} x={(vehicle.length - 0.1) * scale} />
        </g>
      );
    }

    if (vehicle.kind === 'rigid') {
      const cabType = vehicle.cabType ?? 'light-cab-over';
      const Cab = CAB_COMPONENTS[cabType];
      const cabLen = defaultCabLength(vehicle);
      const bodyType = vehicle.bodyType ?? 'box-van';
      const Body = BODY_COMPONENTS[bodyType];
      const bodyLen = vehicle.length - cabLen;
      return (
        <g>
          <Cab
            scale={scale}
            cabLength={cabLen}
            mode="rigid"
            color={vehicle.cabColor}
          />
          <g transform={`translate(${cabLen * scale}, 0)`}>
            <Body
              scale={scale}
              bodyLength={bodyLen}
              deckHeight={deck}
              topHeight={top}
              freightSlots={vehicle.freightSlots?.map((s) => ({
                ...s,
                start: Math.max(0, s.start - cabLen),
              }))}
              color={vehicle.bodyColor}
              vehicle={vehicle}
            />
          </g>
        </g>
      );
    }

    // Trailers (semi, A, B, dog, pig)
    const bodyType = vehicle.bodyType ?? 'curtain-sider';
    const Body = BODY_COMPONENTS[bodyType];
    return (
      <g>
        <Body
          scale={scale}
          bodyLength={vehicle.length}
          deckHeight={deck}
          topHeight={top}
          freightSlots={vehicle.freightSlots}
          color={vehicle.bodyColor}
          vehicle={vehicle}
        />
      </g>
    );
  };

  return (
    <g>
      <GroundShadow length={vehicle.length} scale={scale} />
      {renderShell()}
      <Axles vehicle={vehicle} scale={scale} />
      <Attachments vehicle={vehicle} scale={scale} />
      {/* Freight loads on slots */}
      {(vehicle.freightSlots ?? []).map((s, i) => (
        <FreightOnSlot key={i} slot={s} scale={scale} deckHeight={deck} />
      ))}
    </g>
  );
}

// ---------- Measurement overlays ----------

function WheelbaseRule({
  vehicle,
  scale,
  deck,
}: {
  vehicle: Vehicle;
  scale: number;
  deck: number;
}) {
  if (vehicle.axles.length < 2) return null;
  const first = vehicle.axles[0].position;
  const last = vehicle.axles[vehicle.axles.length - 1].position;
  if (last - first < 0.5) return null;
  const y = (deck * scale) / 2;
  const x1 = first * scale;
  const x2 = last * scale;
  return (
    <g opacity={0.85}>
      <line
        x1={x1}
        y1={y + 6}
        x2={x2}
        y2={y + 6}
        stroke={palette.annotation}
        strokeWidth={0.8}
        strokeDasharray="3 2"
      />
      <line x1={x1} y1={y + 2} x2={x1} y2={y + 10} stroke={palette.annotation} strokeWidth={0.8} />
      <line x1={x2} y1={y + 2} x2={x2} y2={y + 10} stroke={palette.annotation} strokeWidth={0.8} />
      <text
        x={(x1 + x2) / 2}
        y={y + 18}
        textAnchor="middle"
        fontSize={9}
        fontFamily="system-ui, sans-serif"
        fill={palette.annotation}
      >
        {(last - first).toFixed(1)} m
      </text>
    </g>
  );
}

// ---------- Public component ----------

export const TruckCombination = forwardRef<SVGSVGElement, Props>(function TruckCombination(
  {
    combination,
    scale = 26,
    showAnnotations = true,
    showDimensions = true,
    showMeasurements = false,
    highlightId = null,
    height = 260,
    background = 'sky',
    className,
    style,
  }: Props,
  ref,
) {
  const { placed, totalLength } = useMemo(() => layout(combination), [combination]);

  const padX = 24;
  const widthPx = totalLength * scale + padX * 2;
  const groundY = height - 44;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${widthPx} ${height}`}
      width="100%"
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label={`${combination.name} side view`}
    >
      <defs>
        <linearGradient id="truckGenSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.sky1} />
          <stop offset="100%" stopColor={palette.sky2} />
        </linearGradient>
      </defs>
      {background === 'sky' && (
        <rect x={0} y={0} width={widthPx} height={height} fill="url(#truckGenSky)" />
      )}
      {background === 'plain' && (
        <rect x={0} y={0} width={widthPx} height={height} fill="#f8fafc" />
      )}

      {/* Ground line */}
      <line
        x1={0}
        y1={groundY}
        x2={widthPx}
        y2={groundY}
        stroke={palette.ground}
        strokeWidth={1.5}
      />
      <g stroke={palette.groundHash} strokeWidth={0.7}>
        {Array.from({ length: Math.floor(widthPx / 14) }).map((_, i) => (
          <line
            key={i}
            x1={i * 14 + 4}
            y1={groundY + 2}
            x2={i * 14 + 10}
            y2={groundY + 9}
          />
        ))}
      </g>

      <g transform={`translate(${padX}, ${groundY})`}>
        {placed.map(({ v, x0 }) => {
          const dim = highlightId != null && highlightId !== v.id;
          return (
            <g
              key={v.id}
              transform={`translate(${x0 * scale}, 0)`}
              opacity={dim ? 0.35 : 1}
            >
              <VehicleRender vehicle={v} scale={scale} />
              {showMeasurements && (
                <WheelbaseRule vehicle={v} scale={scale} deck={defaultDeckHeight(v)} />
              )}
              {showAnnotations && v.label && (
                <text
                  x={(v.length * scale) / 2}
                  y={-defaultTopHeight(v) * scale - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fontFamily="system-ui, sans-serif"
                  fill={palette.annotation}
                >
                  {v.label}
                </text>
              )}
            </g>
          );
        })}

        {showDimensions && (
          <g transform={`translate(0, 26)`}>
            <line
              x1={0}
              y1={0}
              x2={totalLength * scale}
              y2={0}
              stroke={palette.annotationMuted}
              strokeWidth={1}
            />
            <line x1={0} y1={-4} x2={0} y2={4} stroke={palette.annotationMuted} strokeWidth={1} />
            <line
              x1={totalLength * scale}
              y1={-4}
              x2={totalLength * scale}
              y2={4}
              stroke={palette.annotationMuted}
              strokeWidth={1}
            />
            <text
              x={(totalLength * scale) / 2}
              y={14}
              textAnchor="middle"
              fontSize={11}
              fontFamily="system-ui, sans-serif"
              fill={palette.annotation}
            >
              {totalLength.toFixed(2)} m overall
            </text>
          </g>
        )}
      </g>

    </svg>
  );
});

export default TruckCombination;
