import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { BodyRenderProps } from '../kit/types';
import {
  LandingLegs,
  MarkerLight,
  MudFlap,
  WHEEL_RADIUS_M,
} from '../kit/primitives';

export const defaultProportions = { deckHeight: 0.9, topHeight: 0.9 };

const LowLoader: FC<BodyRenderProps> = ({
  scale,
  bodyLength,
  color,
  vehicle,
}) => {
  const L = bodyLength * scale;
  const deckColor = color ?? palette.flatDeck;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Sections: gooseneck (front high, ~2m), well (very low, 0.4m, bulk), rear bogie riser (~1.0m)
  const gooseLen = Math.min(2.5, bodyLength * 0.2);
  const rearRiseLen = Math.min(2.5, bodyLength * 0.2);
  const wellStart = gooseLen * scale;
  const wellEnd = (bodyLength - rearRiseLen) * scale;

  const gooseTopY = -1.4 * scale;
  const gooseBotY = -0.9 * scale;
  const wellTopY = -0.4 * scale;
  const wellBotY = -0.25 * scale;
  const rearTopY = -1.0 * scale;
  const rearBotY = -0.85 * scale;

  const deckPath = `
    M 0 ${gooseBotY}
    L 0 ${gooseTopY}
    L ${wellStart} ${gooseTopY}
    L ${wellStart} ${wellTopY}
    L ${wellEnd} ${wellTopY}
    L ${wellEnd} ${rearTopY}
    L ${L} ${rearTopY}
    L ${L} ${rearBotY}
    L ${wellEnd + 2} ${rearBotY}
    L ${wellEnd + 2} ${wellBotY}
    L ${wellStart - 2} ${wellBotY}
    L ${wellStart - 2} ${gooseBotY}
    Z
  `;

  return (
    <g>
      <path
        d={deckPath}
        fill={deckColor}
        stroke={palette.chassis}
        strokeWidth={0.8}
      />

      {/* Deck plank suggestion on well */}
      <line
        x1={wellStart}
        y1={wellTopY + 3}
        x2={wellEnd}
        y2={wellTopY + 3}
        stroke={palette.flatDeckLight}
        strokeWidth={0.5}
        opacity={0.7}
      />

      {/* Step highlights */}
      <line x1={wellStart} y1={gooseTopY} x2={wellStart} y2={wellTopY} stroke={palette.chassisLight} strokeWidth={0.8} />
      <line x1={wellEnd} y1={wellTopY} x2={wellEnd} y2={rearTopY} stroke={palette.chassisLight} strokeWidth={0.8} />

      {/* Gooseneck top trim */}
      <rect x={0} y={gooseTopY} width={wellStart} height={0.1 * scale} fill={palette.chassisLight} opacity={0.8} />

      {/* Tie-down rings along well edge */}
      {[0.25, 0.5, 0.75].map((t, i) => (
        <circle
          key={i}
          cx={wellStart + (wellEnd - wellStart) * t}
          cy={wellTopY + 2}
          r={1}
          fill={palette.chassisLight}
        />
      ))}

      {/* Rear riser ribs */}
      {[0.33, 0.66].map((t, i) => (
        <line
          key={i}
          x1={wellEnd + (L - wellEnd) * t}
          y1={rearTopY + 2}
          x2={wellEnd + (L - wellEnd) * t}
          y2={rearBotY - 2}
          stroke={palette.chassisLight}
          strokeWidth={0.5}
        />
      ))}

      <MarkerLight x={0.4 * scale} y={gooseTopY + 3} />
      <MarkerLight x={(wellStart + wellEnd) / 2} y={wellTopY + 2} />
      <MarkerLight x={L - 2} y={rearTopY + 3} color={palette.markerRed} />

      {hasKingpin && <LandingLegs x={1.8 * scale} deckHeight={1.4} scale={scale} raised />}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={1.0} />
    </g>
  );
};

export default LowLoader;
