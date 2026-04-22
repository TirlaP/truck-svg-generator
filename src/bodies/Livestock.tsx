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

const Livestock: FC<BodyRenderProps> = ({
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
  const bodyColor = color ?? palette.livestockWood;
  const slat = accent ?? palette.livestockSlat;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Mid-deck line
  const midY = topY + bodyH * 0.5;

  // Horizontal slats per deck
  const slatPerDeck = 4;
  const deckSlats = (y0: number, y1: number, key: string) => {
    const step = (y1 - y0) / (slatPerDeck + 1);
    return Array.from({ length: slatPerDeck }, (_, i) => (
      <line
        key={`${key}-${i}`}
        x1={0.2 * scale}
        y1={y0 + step * (i + 1)}
        x2={L - 0.2 * scale}
        y2={y0 + step * (i + 1)}
        stroke={slat}
        strokeWidth={0.7}
        opacity={0.9}
      />
    ));
  };

  // Roof vents
  const ventCount = 3;
  const vents = Array.from({ length: ventCount }, (_, i) => {
    const x = ((i + 1) / (ventCount + 1)) * L;
    return (
      <rect
        key={i}
        x={x - 0.3 * scale}
        y={topY - 0.2 * scale}
        width={0.6 * scale}
        height={0.2 * scale}
        fill={palette.chassisLight}
        rx={1}
      />
    );
  });

  // Stock gate bars at rear
  const gateBars = Array.from({ length: 5 }, (_, i) => {
    const x = L - 0.4 * scale + (i / 4) * 0.3 * scale;
    return (
      <line
        key={i}
        x1={x}
        y1={topY + 0.2 * scale}
        x2={x}
        y2={deckY - 1}
        stroke={palette.chassis}
        strokeWidth={0.6}
      />
    );
  });

  return (
    <g>
      {/* Body frame */}
      <rect
        x={0}
        y={topY}
        width={L}
        height={bodyH}
        fill={bodyColor}
        stroke={palette.chassis}
        strokeWidth={0.8}
        rx={1.5}
      />
      {/* Roof */}
      <rect x={0} y={topY} width={L} height={0.18 * scale} fill={palette.chassis} rx={1.5} />
      {vents}

      {/* Middle deck divider */}
      <rect x={0} y={midY - 1} width={L} height={0.1 * scale} fill={palette.chassis} opacity={0.9} />

      {deckSlats(topY + 0.2 * scale, midY - 2, 'upper')}
      {deckSlats(midY + 0.1 * scale, deckY - 2, 'lower')}

      {/* Vertical posts */}
      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
        <line
          key={i}
          x1={t * L}
          y1={topY + 0.2 * scale}
          x2={t * L}
          y2={deckY - 1}
          stroke={palette.chassis}
          strokeWidth={0.6}
        />
      ))}

      {gateBars}

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

export default Livestock;
