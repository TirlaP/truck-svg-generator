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

export const defaultProportions = { deckHeight: 1.3, topHeight: 1.3 };

const Skeletal: FC<BodyRenderProps> = ({
  scale,
  bodyLength,
  deckHeight,
  freightSlots,
  color,
  vehicle,
}) => {
  const L = bodyLength * scale;
  const deckY = -deckHeight * scale;
  const railColor = color ?? palette.skeletalRed;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Main twin rails
  const upperRailY = deckY;
  const lowerRailY = deckY + 0.45 * scale;
  const railH = 0.12 * scale;

  // Cross members
  const crossCount = Math.max(6, Math.round(bodyLength / 1.1));
  const crosses = Array.from({ length: crossCount }, (_, i) => {
    const x = ((i + 0.5) / crossCount) * L;
    return (
      <line
        key={i}
        x1={x}
        y1={upperRailY + railH}
        x2={x}
        y2={lowerRailY}
        stroke={palette.chassisLight}
        strokeWidth={0.7}
      />
    );
  });

  // Twist-lock posts at common container positions
  const postHeight = 0.3 * scale;
  const postPositions = [0.2, 6.3, 12.4, bodyLength - 0.2].filter((p) => p < bodyLength);
  const posts = postPositions.map((p, i) => {
    const x = p * scale;
    return (
      <rect
        key={i}
        x={x - 1.5}
        y={upperRailY - postHeight}
        width={3}
        height={postHeight}
        fill={palette.chassisLight}
        rx={0.5}
      />
    );
  });

  return (
    <g>
      {/* Upper rail */}
      <rect x={0} y={upperRailY} width={L} height={railH} fill={railColor} rx={1} />
      {/* Lower rail */}
      <rect x={0} y={lowerRailY} width={L} height={railH} fill={railColor} opacity={0.85} rx={1} />

      {crosses}
      {posts}

      {/* Kingpin plate at front */}
      <rect x={0} y={upperRailY - 0.15 * scale} width={0.7 * scale} height={0.15 * scale} fill={palette.chassis} />

      <ChassisRail length={bodyLength} scale={scale} deckHeight={deckHeight - 0.15} color={palette.chassis} />

      {/* Freight slots */}
      {freightSlots?.map((slot, i) => (
        <FreightSlotShape
          key={i}
          x={slot.start * scale}
          deckY={deckY}
          width={slot.length * scale}
          height={Math.max(1.2 * scale, 0.6 * scale)}
          label={slot.label}
          loaded={slot.loaded}
        />
      ))}

      <MarkerLight x={0.4 * scale} y={upperRailY - postHeight - 2} />
      <MarkerLight x={L * 0.5} y={upperRailY - 2} />
      <MarkerLight x={L - 2} y={upperRailY - 2} color={palette.markerRed} />

      {hasKingpin && <LandingLegs x={2.0 * scale} deckHeight={deckHeight} scale={scale} raised />}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={deckHeight} />
    </g>
  );
};

export default Skeletal;
