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

const Refrigerated: FC<BodyRenderProps> = ({
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
  const bodyColor = color ?? palette.reeferBody;
  const trim = accent ?? palette.reeferTrim;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Reefer unit (front, above body top)
  const unitW = 1.0 * scale;
  const unitH = 0.9 * scale;

  // Corrugations
  const ribCount = Math.max(5, Math.round(bodyLength / 1.4));
  const ribs = Array.from({ length: ribCount }, (_, i) => {
    const x = ((i + 0.5) / ribCount) * L;
    return (
      <line
        key={i}
        x1={x}
        y1={topY + 0.25 * scale}
        x2={x}
        y2={deckY - 2}
        stroke={palette.reeferPanel}
        strokeWidth={0.6}
        opacity={0.8}
      />
    );
  });

  return (
    <g>
      {/* Reefer condenser unit */}
      <rect
        x={-0.1 * scale}
        y={topY - unitH}
        width={unitW}
        height={unitH}
        fill={trim}
        stroke={palette.chassis}
        strokeWidth={0.6}
        rx={1.5}
      />
      {/* Vent grille */}
      <rect x={0.05 * scale} y={topY - unitH + 0.15 * scale} width={unitW - 0.3 * scale} height={0.25 * scale} fill={palette.reeferPanel} rx={1} />
      <line x1={0.05 * scale} y1={topY - unitH + 0.2 * scale} x2={unitW - 0.25 * scale} y2={topY - unitH + 0.2 * scale} stroke={trim} strokeWidth={0.3} />
      <line x1={0.05 * scale} y1={topY - unitH + 0.3 * scale} x2={unitW - 0.25 * scale} y2={topY - unitH + 0.3 * scale} stroke={trim} strokeWidth={0.3} />

      {/* Insulated box */}
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
      {/* Top trim band */}
      <rect x={0} y={topY} width={L} height={0.15 * scale} fill={trim} opacity={0.9} rx={2} />
      {/* Bottom trim */}
      <rect x={0} y={deckY - 0.1 * scale} width={L} height={0.1 * scale} fill={trim} opacity={0.85} />

      {ribs}

      {/* Rear doors */}
      <line x1={L - 0.1 * scale} y1={topY + 2} x2={L - 0.1 * scale} y2={deckY - 2} stroke={trim} strokeWidth={0.8} />
      <line x1={L * 0.5 + (L * 0.5 - 0.1 * scale)} y1={topY + 3} x2={L * 0.5 + (L * 0.5 - 0.1 * scale)} y2={deckY - 2} stroke={trim} strokeWidth={0.4} opacity={0.6} />
      {/* Hinges */}
      {[topY + 0.3 * scale, topY + bodyH * 0.5, deckY - 0.3 * scale].map((y, i) => (
        <rect key={i} x={L - 0.2 * scale} y={y - 1} width={0.15 * scale} height={0.15 * scale} fill={trim} />
      ))}
      {/* Door handle */}
      <rect x={L - 0.35 * scale} y={topY + bodyH * 0.55} width={0.08 * scale} height={0.4 * scale} fill={trim} />

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

export default Refrigerated;
