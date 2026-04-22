import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { BodyRenderProps } from '../kit/types';
import {
  ChassisRail,
  FreightSlotShape,
  LandingLegs,
  MarkerLight,
  MudFlap,
  WHEEL_RADIUS_M,
} from '../kit/primitives';

export const defaultProportions = { deckHeight: 1.35, topHeight: 3.8 };

const CarCarrier: FC<BodyRenderProps> = ({
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
  const lowerDeckY = -deckHeight * scale;
  const upperDeckY = -topHeight * scale;
  const frameColor = color ?? palette.chassis;
  const railColor = accent ?? palette.chassisLight;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  const frameThickness = 0.08 * scale;

  // Upper deck: hinged so it angles slightly — front end higher than rear
  const upperFrontY = upperDeckY - 0.2 * scale;
  const upperRearY = upperDeckY + 0.2 * scale;

  // Vertical posts
  const postCount = Math.max(4, Math.round(bodyLength / 2.5));
  const posts = Array.from({ length: postCount }, (_, i) => {
    const t = i / (postCount - 1);
    const x = t * L;
    const yTop = upperFrontY + (upperRearY - upperFrontY) * t;
    return (
      <rect
        key={i}
        x={x - 1}
        y={yTop}
        width={2}
        height={lowerDeckY - yTop}
        fill={frameColor}
      />
    );
  });

  // Diagonal braces on lower deck outriggers
  const braces = [0.15, 0.4, 0.65, 0.9].map((t, i) => {
    const x1 = t * L;
    const x2 = x1 + 0.8 * scale;
    return (
      <line
        key={i}
        x1={x1}
        y1={lowerDeckY}
        x2={x2}
        y2={lowerDeckY + 0.35 * scale}
        stroke={railColor}
        strokeWidth={0.6}
        opacity={0.7}
      />
    );
  });

  return (
    <g>
      {/* Lower deck rail */}
      <rect x={0} y={lowerDeckY} width={L} height={frameThickness} fill={railColor} rx={1} />
      <rect x={0} y={lowerDeckY + 0.4 * scale} width={L} height={frameThickness} fill={railColor} opacity={0.75} rx={1} />

      {/* Upper deck (angled) */}
      <line
        x1={0}
        y1={upperFrontY}
        x2={L}
        y2={upperRearY}
        stroke={railColor}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <line
        x1={0}
        y1={upperFrontY + frameThickness + 2}
        x2={L}
        y2={upperRearY + frameThickness + 2}
        stroke={railColor}
        strokeWidth={1}
        opacity={0.6}
      />

      {posts}
      {braces}

      {/* Front mast / loading ramp indicator */}
      <rect
        x={0}
        y={upperFrontY - 0.3 * scale}
        width={0.15 * scale}
        height={0.3 * scale}
        fill={frameColor}
      />

      {/* Rear ramp hint */}
      <line
        x1={L}
        y1={lowerDeckY}
        x2={L + 0.6 * scale}
        y2={lowerDeckY + 0.3 * scale}
        stroke={railColor}
        strokeWidth={2}
        strokeLinecap="round"
      />

      <ChassisRail length={bodyLength} scale={scale} deckHeight={deckHeight - 0.15} />

      {/* Freight slots (two decks) */}
      {freightSlots?.map((slot, i) => {
        const isUpper = i % 2 === 1;
        const dY = isUpper ? upperDeckY : lowerDeckY;
        return (
          <FreightSlotShape
            key={i}
            x={slot.start * scale}
            deckY={dY}
            width={slot.length * scale}
            height={1.5 * scale}
            label={slot.label}
            loaded={slot.loaded}
          />
        );
      })}

      <MarkerLight x={0.4 * scale} y={upperFrontY - 2} />
      <MarkerLight x={L * 0.5} y={(upperFrontY + upperRearY) / 2 - 2} />
      <MarkerLight x={L - 2} y={upperRearY - 2} color={palette.markerRed} />

      {hasKingpin && <LandingLegs x={2.0 * scale} deckHeight={deckHeight} scale={scale} raised />}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={deckHeight} />
    </g>
  );
};

export default CarCarrier;
