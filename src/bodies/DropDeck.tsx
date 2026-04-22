import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { BodyRenderProps } from '../kit/types';
import {
  FreightSlotShape,
  LandingLegs,
  MarkerLight,
  MudFlap,
  WHEEL_RADIUS_M,
} from '../kit/primitives';

export const defaultProportions = { deckHeight: 1.35, topHeight: 1.35 };

const DropDeck: FC<BodyRenderProps> = ({
  scale,
  bodyLength,
  deckHeight,
  freightSlots,
  color,
  vehicle,
}) => {
  const L = bodyLength * scale;
  const deckColor = color ?? palette.flatDeck;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Front section full deckHeight (~first 4m); rear section drops to 0.8m
  const frontLen = Math.min(4, bodyLength * 0.3);
  const frontW = frontLen * scale;
  const rearLow = 0.8;
  const deckThickness = 0.18 * scale;

  const frontDeckY = -deckHeight * scale;
  const rearDeckY = -rearLow * scale;

  // Headboard at front
  const headboardH = 1.4 * scale;

  // Cross-bearers on rear portion
  const rearCount = 5;
  const bearers = Array.from({ length: rearCount }, (_, i) => {
    const x = frontW + ((i + 0.5) / rearCount) * (L - frontW);
    return (
      <rect
        key={i}
        x={x - 1}
        y={rearDeckY + deckThickness}
        width={2}
        height={0.22 * scale}
        fill={palette.chassisLight}
      />
    );
  });

  return (
    <g>
      {/* Front high deck */}
      <rect
        x={0}
        y={frontDeckY}
        width={frontW}
        height={deckThickness}
        fill={deckColor}
        stroke={palette.chassis}
        strokeWidth={0.6}
        rx={1}
      />
      {/* Step riser */}
      <rect
        x={frontW - deckThickness}
        y={frontDeckY + deckThickness}
        width={deckThickness}
        height={rearDeckY - frontDeckY - deckThickness}
        fill={palette.chassisLight}
      />
      {/* Rear low deck */}
      <rect
        x={frontW}
        y={rearDeckY}
        width={L - frontW}
        height={deckThickness}
        fill={deckColor}
        stroke={palette.chassis}
        strokeWidth={0.6}
        rx={1}
      />

      {/* Plank hint */}
      <line
        x1={frontW}
        y1={rearDeckY + deckThickness * 0.55}
        x2={L}
        y2={rearDeckY + deckThickness * 0.55}
        stroke={palette.flatDeckLight}
        strokeWidth={0.4}
        opacity={0.6}
      />

      {bearers}

      {/* Headboard */}
      <rect
        x={0}
        y={frontDeckY - headboardH}
        width={0.15 * scale}
        height={headboardH}
        fill={palette.chassisLight}
        rx={1}
      />
      <rect x={0} y={frontDeckY - headboardH} width={0.5 * scale} height={0.08 * scale} fill={palette.chassisLight} />

      {/* Upper rail front chassis */}
      <rect x={0} y={frontDeckY + deckThickness} width={frontW} height={3} fill={palette.chassis} />
      {/* Lower rail rear chassis */}
      <rect x={frontW} y={rearDeckY + deckThickness + 2} width={L - frontW} height={3} fill={palette.chassis} />

      {/* Freight slots */}
      {freightSlots?.map((slot, i) => {
        const slotStart = slot.start;
        const onFront = slotStart + slot.length / 2 < frontLen;
        const dY = onFront ? frontDeckY : rearDeckY;
        return (
          <FreightSlotShape
            key={i}
            x={slot.start * scale}
            deckY={dY}
            width={slot.length * scale}
            height={Math.max(1.2 * scale, 0.6 * scale)}
            label={slot.label}
            loaded={slot.loaded}
          />
        );
      })}

      <MarkerLight x={0.4 * scale} y={frontDeckY - headboardH + 3} />
      <MarkerLight x={(frontW + L) / 2} y={rearDeckY + 2} />
      <MarkerLight x={L - 2} y={rearDeckY + 2} color={palette.markerRed} />

      {hasKingpin && <LandingLegs x={2.0 * scale} deckHeight={deckHeight} scale={scale} raised />}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={rearLow} />
    </g>
  );
};

export default DropDeck;
