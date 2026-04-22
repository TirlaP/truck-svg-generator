import { palette } from './palette';
import type { AxleGroup } from '../types';

export const WHEEL_RADIUS_M = 0.52;
export const DUAL_TYRE_OFFSET_M = 0.42; // distance between dual tyres (side view overlap)

/** Draw an axle group centred at local x=0 on the ground line (y=0). */
export function Wheels({
  group,
  scale,
  suspensionTop,
}: {
  group: AxleGroup;
  scale: number;
  /** How far above ground the suspension bracket sits (m). */
  suspensionTop: number;
}) {
  const spacing = group.spacing ?? 1.3;
  const r = WHEEL_RADIUS_M * scale;
  const centerOffset = ((group.count - 1) * spacing) / 2;
  const tyres = group.tyres ?? (group.count === 1 ? 'single' : 'dual');
  const lift = group.lifted ? 0.15 * scale : 0;
  const cy = -r + lift;

  const suspW = ((group.count - 1) * spacing + 1.15) * scale;
  const suspTopPx = -suspensionTop * scale;
  const suspHeight = Math.max(suspensionTop * scale - r * 2 + 4, 4);

  const wheels = [];
  for (let i = 0; i < group.count; i++) {
    const dx = (i * spacing - centerOffset) * scale;
    const dualOffset = DUAL_TYRE_OFFSET_M * scale * 0.35;
    wheels.push(
      <g key={`w${i}`} transform={`translate(${dx}, 0)`}>
        {tyres === 'dual' && (
          <>
            {/* Back (inner) tyre — slightly offset to suggest the second tyre behind */}
            <circle cx={-dualOffset} cy={cy} r={r * 0.98} fill={palette.tyre} opacity={0.7} />
            {/* Back rim face peeking behind */}
            <circle cx={-dualOffset} cy={cy} r={r * 0.38} fill={palette.rimDark} opacity={0.9} />
          </>
        )}
        {/* Main tyre */}
        <circle cx={0} cy={cy} r={r} fill={palette.tyre} stroke={palette.tyreOutline} strokeWidth={0.6} />
        {/* Tyre tread hint — faint outer ring */}
        <circle cx={0} cy={cy} r={r * 0.92} fill="none" stroke={palette.chassisLight} strokeWidth={0.5} opacity={0.45} />
        {/* Rim */}
        <circle cx={0} cy={cy} r={r * 0.45} fill={palette.rim} />
        <circle cx={0} cy={cy} r={r * 0.45} fill="none" stroke={palette.rimDark} strokeWidth={0.6} />
        {/* Hub */}
        <circle cx={0} cy={cy} r={r * 0.16} fill={palette.rimDark} />
        {/* Wheel nuts — 5 dots around the hub */}
        {[0, 1, 2, 3, 4].map((n) => {
          const a = (n / 5) * Math.PI * 2 - Math.PI / 2;
          return (
            <circle
              key={n}
              cx={Math.cos(a) * r * 0.3}
              cy={cy + Math.sin(a) * r * 0.3}
              r={r * 0.045}
              fill={palette.rimDark}
            />
          );
        })}
      </g>,
    );
  }

  return (
    <g>
      {/* Suspension / leaf pack */}
      <rect
        x={-suspW / 2}
        y={suspTopPx}
        width={suspW}
        height={suspHeight}
        fill={palette.chassisLight}
        rx={2}
      />
      {/* Leaf-spring hint — two thin lines */}
      <line
        x1={-suspW / 2 + 4}
        y1={suspTopPx + suspHeight * 0.4}
        x2={suspW / 2 - 4}
        y2={suspTopPx + suspHeight * 0.4}
        stroke={palette.chassis}
        strokeWidth={0.6}
        opacity={0.5}
      />
      {/* Axle bar */}
      <rect x={-suspW / 2} y={cy - 2} width={suspW} height={4} fill={palette.chassisLight} rx={1} />
      {wheels}
    </g>
  );
}

/** A full-length chassis rail at given deck height. */
export function ChassisRail({
  length,
  scale,
  deckHeight,
  color = palette.chassis,
}: {
  length: number;
  scale: number;
  deckHeight: number;
  color?: string;
}) {
  const y = -deckHeight * scale + 2;
  return <rect x={0} y={y} width={length * scale} height={4} fill={color} />;
}

/** Mud flap behind a wheel group. */
export function MudFlap({ scale, deckHeight, x }: { scale: number; deckHeight: number; x: number }) {
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect
        x={-1}
        y={-deckHeight * scale * 0.55}
        width={2}
        height={deckHeight * scale * 0.45}
        fill={palette.cabDark}
      />
      <rect
        x={-6}
        y={-deckHeight * scale * 0.18}
        width={12}
        height={deckHeight * scale * 0.24}
        fill={palette.cabDark}
        rx={1}
      />
    </g>
  );
}

/** Amber side-marker light. */
export function MarkerLight({
  x,
  y,
  color = palette.markerAmber,
  radius = 1.2,
}: {
  x: number;
  y: number;
  color?: string;
  radius?: number;
}) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx={0} cy={0} r={radius + 0.6} fill="rgba(255,255,255,0.35)" />
      <circle cx={0} cy={0} r={radius} fill={color} />
    </g>
  );
}

/** Side-skirt between axle groups (aerodynamic panel). */
export function SideSkirt({
  x,
  width,
  scale,
  deckHeight,
  color = palette.cabWhite,
}: {
  x: number;
  width: number;
  scale: number;
  deckHeight: number;
  color?: string;
}) {
  const height = deckHeight * scale - WHEEL_RADIUS_M * scale - 2;
  return (
    <rect
      x={x}
      y={-deckHeight * scale + 4}
      width={width}
      height={height}
      fill={color}
      opacity={0.9}
      rx={1}
    />
  );
}

/** A soft ground shadow under the full length of a vehicle. */
export function GroundShadow({ length, scale }: { length: number; scale: number }) {
  return (
    <ellipse
      cx={(length * scale) / 2}
      cy={4}
      rx={(length * scale) / 2}
      ry={3.5}
      fill={palette.groundShadow}
    />
  );
}

/** Windshield polygon (useful for cabs). */
export function Windshield({
  x1,
  y1,
  x2,
  y2,
  fill = palette.window,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  fill?: string;
}) {
  return (
    <polygon
      points={`${x1},${y2} ${x2},${y2} ${x2 - 2},${y1} ${x1 + 2},${y1}`}
      fill={fill}
      stroke={palette.cabDark}
      strokeWidth={0.5}
    />
  );
}

/** Tractor chassis tail — fuel tanks + frame between cab and rear of prime mover. */
export function TractorChassis({
  startX,
  endX,
  scale,
  deckHeight,
}: {
  startX: number;
  endX: number;
  scale: number;
  deckHeight: number;
}) {
  const width = endX - startX;
  if (width <= 0) return null;
  const tankH = 0.9 * scale;
  const tankW = Math.min(1.6 * scale, width * 0.55);
  return (
    <g transform={`translate(${startX}, 0)`}>
      {/* Frame */}
      <rect
        x={0}
        y={-deckHeight * scale + 2}
        width={width}
        height={4}
        fill={palette.chassis}
      />
      {/* Fuel tank */}
      <rect
        x={4}
        y={-deckHeight * scale - tankH * 0.15}
        width={tankW}
        height={tankH}
        fill={palette.rim}
        stroke={palette.rimDark}
        strokeWidth={0.7}
        rx={3}
      />
      <rect
        x={6}
        y={-deckHeight * scale + tankH * 0.2}
        width={tankW - 4}
        height={2}
        fill={palette.rimDark}
        rx={1}
      />
    </g>
  );
}

/** Exhaust stack (chrome pipe sticking up behind the cab). */
export function ExhaustStack({
  x,
  scale,
  height = 3.6,
  side = 'right',
}: {
  x: number;
  scale: number;
  height?: number;
  side?: 'left' | 'right';
}) {
  const h = height * scale;
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect x={-2} y={-h} width={4} height={h - 2} fill={palette.rim} stroke={palette.rimDark} strokeWidth={0.5} />
      <rect x={-3} y={-h - 2} width={6} height={3} fill={palette.rimDark} />
      {/* Heat shield ring */}
      <rect x={-3.5} y={-h * 0.55} width={7} height={2} fill={palette.rimDark} rx={1} />
      {side === 'left' ? null : null}
    </g>
  );
}

/** Doorline for cab (simple vertical seam + handle). */
export function CabDoor({ x, topY, bottomY }: { x: number; topY: number; bottomY: number }) {
  return (
    <g>
      <line x1={x} y1={topY} x2={x} y2={bottomY} stroke={palette.cabDark} strokeWidth={0.6} />
      <rect x={x + 3} y={topY + (bottomY - topY) * 0.55} width={4} height={1.5} fill={palette.cabDark} rx={0.5} />
    </g>
  );
}

/** Kingpin marker under a trailer. */
export function KingpinMarker({ x, deckY }: { x: number; deckY: number }) {
  return (
    <g transform={`translate(${x}, ${deckY})`}>
      <rect x={-5} y={0} width={10} height={3} fill={palette.chassisLight} rx={1} />
      <polygon points={`-4,3 4,3 0,9`} fill={palette.cabDark} />
      <circle cx={0} cy={10} r={2.5} fill={palette.cabDark} />
    </g>
  );
}

/** Fifth-wheel / turntable plate on top of prime mover or A-trailer. */
export function TurntableMarker({ x, deckY }: { x: number; deckY: number }) {
  return (
    <g transform={`translate(${x}, ${deckY - 3})`}>
      <rect x={-13} y={0} width={26} height={3} fill={palette.chassisMid} rx={1} />
      <rect x={-13} y={-2} width={26} height={2} fill={palette.chassisLight} rx={1} />
      <circle cx={0} cy={1.5} r={4} fill={palette.cabDark} />
      <circle cx={0} cy={1.5} r={1.5} fill={palette.rim} />
    </g>
  );
}

/** Drawbar rendering (eye end + tow-bar). */
export function DrawbarEye({ x, deckHeight, scale }: { x: number; deckHeight: number; scale: number }) {
  return (
    <g transform={`translate(${x}, ${-deckHeight * scale * 0.55})`}>
      <line x1={0} y1={0} x2={0.9 * scale} y2={0} stroke={palette.chassis} strokeWidth={3} strokeLinecap="round" />
      <circle cx={0} cy={0} r={4} fill="none" stroke={palette.chassis} strokeWidth={2} />
    </g>
  );
}

export function DrawbarHitch({ x, deckHeight, scale }: { x: number; deckHeight: number; scale: number }) {
  return (
    <g transform={`translate(${x}, ${-deckHeight * scale * 0.55})`}>
      <rect x={-2} y={-5} width={6} height={10} fill={palette.chassis} rx={1} />
      <circle cx={1} cy={0} r={2.5} fill={palette.rim} />
    </g>
  );
}

/** Landing legs under the front of a trailer (raised when coupled). */
export function LandingLegs({
  x,
  deckHeight,
  scale,
  raised = true,
}: {
  x: number;
  deckHeight: number;
  scale: number;
  raised?: boolean;
}) {
  const legHeight = (deckHeight - WHEEL_RADIUS_M) * scale * (raised ? 0.65 : 1.0);
  return (
    <g transform={`translate(${x}, 0)`}>
      {[-3, 3].map((dx) => (
        <rect
          key={dx}
          x={dx - 1}
          y={-deckHeight * scale}
          width={2}
          height={legHeight}
          fill={palette.rimDark}
        />
      ))}
      <rect
        x={-5}
        y={-deckHeight * scale + legHeight}
        width={10}
        height={2}
        fill={palette.chassisLight}
        rx={0.5}
      />
    </g>
  );
}

/** Render a freight slot placeholder (dashed rectangle when empty). */
export function FreightSlotShape({
  x,
  deckY,
  width,
  height,
  label,
  loaded,
}: {
  x: number;
  deckY: number;
  width: number;
  height: number;
  label?: string;
  loaded?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={deckY - height}
        width={width}
        height={height}
        fill={loaded ? palette.slotLoadedFill : palette.slotFill}
        stroke={loaded ? palette.slotLoadedStroke : palette.slotStroke}
        strokeWidth={1}
        strokeDasharray={loaded ? undefined : '4 3'}
        rx={1.5}
      />
      {label && (
        <text
          x={x + width / 2}
          y={deckY - height / 2 + 3.5}
          textAnchor="middle"
          fontSize={10}
          fontFamily="system-ui, sans-serif"
          fill={palette.annotation}
        >
          {label}
        </text>
      )}
    </g>
  );
}
