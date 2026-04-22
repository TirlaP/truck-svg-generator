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

const CurtainSider: FC<BodyRenderProps> = ({
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
  const curtainColor = accent ?? palette.curtainGreen;
  const frameColor = color ?? palette.curtainTrim;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Tensioning straps
  const strapSpacing = 1.2;
  const strapCount = Math.max(3, Math.floor(bodyLength / strapSpacing));
  const straps = Array.from({ length: strapCount }, (_, i) => {
    const x = ((i + 1) / (strapCount + 1)) * L;
    return (
      <line
        key={i}
        x1={x}
        y1={topY + 3}
        x2={x}
        y2={deckY - 1}
        stroke={palette.curtainTrim}
        strokeWidth={0.6}
        opacity={0.7}
      />
    );
  });

  return (
    <g>
      {/* Body area (curtain) */}
      <rect
        x={0}
        y={topY}
        width={L}
        height={bodyH}
        fill={curtainColor}
        stroke={frameColor}
        strokeWidth={0.8}
        rx={2}
      />
      {/* Roof band */}
      <rect x={0} y={topY} width={L} height={0.18 * scale} fill={frameColor} opacity={0.85} rx={2} />

      {/* Canvas horizontal lines */}
      <line
        x1={2}
        y1={topY + bodyH * 0.35}
        x2={L - 2}
        y2={topY + bodyH * 0.35}
        stroke={palette.curtainTrim}
        strokeWidth={0.3}
        opacity={0.35}
      />
      <line
        x1={2}
        y1={topY + bodyH * 0.7}
        x2={L - 2}
        y2={topY + bodyH * 0.7}
        stroke={palette.curtainTrim}
        strokeWidth={0.3}
        opacity={0.35}
      />

      {straps}

      {/* Front vertical post */}
      <rect x={0} y={topY} width={0.15 * scale} height={bodyH} fill={frameColor} />
      {/* Rear door frame */}
      <rect x={L - 0.2 * scale} y={topY} width={0.2 * scale} height={bodyH} fill={frameColor} />
      <line
        x1={L - 0.35 * scale}
        y1={topY + 2}
        x2={L - 0.35 * scale}
        y2={deckY - 1}
        stroke={palette.curtainTrim}
        strokeWidth={0.5}
      />

      {/* Bottom rail */}
      <rect x={0} y={deckY - 0.12 * scale} width={L} height={0.12 * scale} fill={frameColor} />

      <ChassisRail length={bodyLength} scale={scale} deckHeight={deckHeight - 0.15} />
      <SideSkirt x={3.5 * scale} width={Math.max(0, bodyLength * scale - 6 * scale)} scale={scale} deckHeight={deckHeight} color={curtainColor} />

      {/* Freight slots (faint, inside) */}
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

      {/* Markers */}
      <MarkerLight x={0.6 * scale} y={topY + 3} />
      <MarkerLight x={L * 0.5} y={topY + 3} />
      <MarkerLight x={L - 0.6 * scale} y={topY + 3} color={palette.markerRed} />

      {hasKingpin && <LandingLegs x={2.0 * scale} deckHeight={deckHeight} scale={scale} raised />}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={deckHeight} />
    </g>
  );
};

export default CurtainSider;
