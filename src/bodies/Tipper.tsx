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

export const defaultProportions = { deckHeight: 1.35, topHeight: 3.2 };

const Tipper: FC<BodyRenderProps> = ({
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
  const bodyColor = color ?? palette.tipperYellow;
  const dark = accent ?? palette.tipperYellowDark;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Trapezoidal: front taller, rear lower.
  const frontTop = -topHeight * scale;
  const rearTop = -(topHeight - 0.4) * scale;

  const hopperPath = `
    M 0 ${deckY}
    L 0 ${frontTop}
    L ${L} ${rearTop}
    L ${L} ${deckY}
    Z
  `;

  // Ribs
  const ribCount = 4;
  const ribs = Array.from({ length: ribCount }, (_, i) => {
    const t = (i + 1) / (ribCount + 1);
    const x = t * L;
    const yTop = frontTop + (rearTop - frontTop) * t;
    return (
      <line
        key={i}
        x1={x}
        y1={yTop + 2}
        x2={x}
        y2={deckY - 1}
        stroke={dark}
        strokeWidth={0.8}
      />
    );
  });

  return (
    <g>
      {/* Hopper body */}
      <path
        d={hopperPath}
        fill={bodyColor}
        stroke={palette.chassis}
        strokeWidth={0.8}
      />
      {/* Top rim */}
      <line x1={0} y1={frontTop} x2={L} y2={rearTop} stroke={dark} strokeWidth={1} />
      {/* Front wall vertical */}
      <rect x={0} y={frontTop} width={0.15 * scale} height={deckY - frontTop} fill={dark} />
      {/* Tailgate */}
      <rect x={L - 0.15 * scale} y={rearTop} width={0.15 * scale} height={deckY - rearTop} fill={dark} />

      {ribs}

      {/* Hydraulic ram hint */}
      <line
        x1={0.3 * scale}
        y1={deckY - 0.2 * scale}
        x2={2.2 * scale}
        y2={frontTop + 0.4 * scale}
        stroke={palette.rim}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <circle cx={0.3 * scale} cy={deckY - 0.2 * scale} r={2} fill={palette.rimDark} />

      <ChassisRail length={bodyLength} scale={scale} deckHeight={deckHeight - 0.15} />

      <MarkerLight x={0.6 * scale} y={frontTop + 3} />
      <MarkerLight x={L * 0.5} y={frontTop + (rearTop - frontTop) * 0.5 + 3} />
      <MarkerLight x={L - 0.6 * scale} y={rearTop + 3} color={palette.markerRed} />

      {hasKingpin && <LandingLegs x={2.0 * scale} deckHeight={deckHeight} scale={scale} raised />}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={deckHeight} />
    </g>
  );
};

export default Tipper;
