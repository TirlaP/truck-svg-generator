import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { BodyRenderProps } from '../kit/types';
import {
  ChassisRail,
  FreightSlotShape,
  LandingLegs,
  MarkerLight,
  MudFlap,
  SideSkirt,
  WHEEL_RADIUS_M,
} from '../kit/primitives';

export const defaultProportions = { deckHeight: 1.35, topHeight: 3.9 };

const BoxVan: FC<BodyRenderProps> = ({
  scale,
  bodyLength,
  deckHeight,
  topHeight,
  freightSlots,
  color,
  accent,
  vehicle,
}) => {
  const L = bodyLength * scale;
  const deckY = -deckHeight * scale;
  const topY = -topHeight * scale;
  const bodyH = (topHeight - deckHeight) * scale;
  const bodyColor = color ?? palette.boxVanBlue;
  const trim = accent ?? palette.curtainTrim;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Reinforcement ribs
  const ribCount = Math.max(4, Math.round(bodyLength / 1.5));
  const ribs = Array.from({ length: ribCount }, (_, i) => {
    const x = ((i + 0.5) / ribCount) * L;
    return (
      <line
        key={i}
        x1={x}
        y1={topY + 0.2 * scale}
        x2={x}
        y2={deckY - 2}
        stroke={trim}
        strokeWidth={0.5}
        opacity={0.35}
      />
    );
  });

  // Rear roller door (horizontal slat lines)
  const slatCount = 10;
  const slats = Array.from({ length: slatCount }, (_, i) => {
    const y = topY + 0.3 * scale + (i / slatCount) * (bodyH - 0.4 * scale);
    return (
      <line
        key={i}
        x1={L - 0.55 * scale}
        y1={y}
        x2={L - 0.08 * scale}
        y2={y}
        stroke={trim}
        strokeWidth={0.4}
        opacity={0.6}
      />
    );
  });

  return (
    <g>
      {/* Box body */}
      <rect
        x={0}
        y={topY}
        width={L}
        height={bodyH}
        fill={bodyColor}
        stroke={trim}
        strokeWidth={0.8}
        rx={2}
      />
      {/* Top trim */}
      <rect x={0} y={topY} width={L} height={0.15 * scale} fill={trim} opacity={0.8} rx={2} />
      {/* Bottom trim */}
      <rect x={0} y={deckY - 0.1 * scale} width={L} height={0.1 * scale} fill={trim} opacity={0.7} />

      {ribs}

      {/* Rear roller door frame */}
      <rect
        x={L - 0.6 * scale}
        y={topY + 0.25 * scale}
        width={0.55 * scale}
        height={bodyH - 0.4 * scale}
        fill={bodyColor}
        stroke={trim}
        strokeWidth={0.6}
        opacity={0.95}
        rx={1}
      />
      {slats}
      {/* Handle */}
      <rect
        x={L - 0.45 * scale}
        y={topY + bodyH * 0.72}
        width={0.3 * scale}
        height={0.1 * scale}
        fill={trim}
        rx={0.5}
      />

      <ChassisRail length={bodyLength} scale={scale} deckHeight={deckHeight - 0.15} />
      <SideSkirt x={3.5 * scale} width={Math.max(0, L - 6 * scale)} scale={scale} deckHeight={deckHeight} color={bodyColor} />

      {freightSlots?.map((slot, i) => (
        <g key={i} opacity={0.5}>
          <FreightSlotShape
            x={slot.start * scale}
            deckY={deckY}
            width={slot.length * scale}
            height={bodyH * 0.9}
            label={slot.label}
            loaded={slot.loaded}
          />
        </g>
      ))}

      <MarkerLight x={0.6 * scale} y={topY + 3} />
      <MarkerLight x={L * 0.5} y={topY + 3} />
      <MarkerLight x={L - 0.6 * scale} y={topY + 3} color={palette.markerRed} />

      {hasKingpin && <LandingLegs x={2.0 * scale} deckHeight={deckHeight} scale={scale} raised />}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={deckHeight} />
    </g>
  );
};

export default BoxVan;
