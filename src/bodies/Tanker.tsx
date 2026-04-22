import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { BodyRenderProps } from '../kit/types';
import {
  ChassisRail,
  LandingLegs,
  MarkerLight,
  MudFlap,
  WHEEL_RADIUS_M,
} from '../kit/primitives';

export const defaultProportions = { deckHeight: 1.35, topHeight: 3.4 };

const Tanker: FC<BodyRenderProps> = ({
  scale,
  bodyLength,
  deckHeight,
  topHeight,
  color,
  accent,
  vehicle,
}) => {
  const L = bodyLength * scale;
  const deckY = -deckHeight * scale;
  const topY = -topHeight * scale;
  const tankColor = color ?? palette.tankerBody;
  const band = accent ?? palette.tankerBand;
  const trim = palette.tankerTrim;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  const tankTopY = topY;
  const tankBottomY = deckY - 0.05 * scale;
  const tankH = tankBottomY - tankTopY;
  const rx = tankH * 0.5;

  // Bands
  const bandCount = 3;
  const bands = Array.from({ length: bandCount }, (_, i) => {
    const x = ((i + 1) / (bandCount + 1)) * L;
    return (
      <rect
        key={i}
        x={x - 1.5}
        y={tankTopY + 2}
        width={3}
        height={tankH - 4}
        fill={band}
        opacity={0.65}
      />
    );
  });

  // Manhole / dome
  const manholeX = L * 0.35;
  const manholeW = 0.5 * scale;
  const manholeH = 0.22 * scale;

  return (
    <g>
      {/* Frame at deck */}
      <rect x={0} y={deckY - 0.08 * scale} width={L} height={0.15 * scale} fill={trim} />

      {/* Tank capsule */}
      <rect
        x={0}
        y={tankTopY}
        width={L}
        height={tankH}
        rx={rx}
        fill={tankColor}
        stroke={trim}
        strokeWidth={0.8}
      />

      {/* Highlight */}
      <rect
        x={rx}
        y={tankTopY + 2}
        width={Math.max(0, L - rx * 2)}
        height={1.5}
        fill={palette.cabWhite}
        opacity={0.5}
        rx={0.5}
      />

      {bands}

      {/* Manhole dome */}
      <rect
        x={manholeX - manholeW / 2}
        y={tankTopY - manholeH + 1}
        width={manholeW}
        height={manholeH}
        rx={2}
        fill={band}
        stroke={trim}
        strokeWidth={0.5}
      />
      <circle cx={manholeX} cy={tankTopY + 1} r={2} fill={trim} />

      {/* Catwalk along top */}
      <rect
        x={manholeX + manholeW / 2 + 2}
        y={tankTopY - 1}
        width={L - manholeX - manholeW / 2 - 4}
        height={1.2}
        fill={trim}
        opacity={0.7}
      />

      {/* Rear discharge valves */}
      <rect
        x={L - 0.8 * scale}
        y={tankBottomY}
        width={0.7 * scale}
        height={0.35 * scale}
        fill={trim}
        rx={1}
      />
      <circle cx={L - 0.45 * scale} cy={tankBottomY + 0.18 * scale} r={2} fill={palette.rim} />

      <ChassisRail length={bodyLength} scale={scale} deckHeight={deckHeight - 0.15} />

      <MarkerLight x={0.6 * scale} y={tankTopY + 4} />
      <MarkerLight x={L * 0.5} y={tankTopY + 4} />
      <MarkerLight x={L - 0.6 * scale} y={tankTopY + 4} color={palette.markerRed} />

      {hasKingpin && <LandingLegs x={2.0 * scale} deckHeight={deckHeight} scale={scale} raised />}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={deckHeight} />
    </g>
  );
};

export default Tanker;
