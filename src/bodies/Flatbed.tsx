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

export const defaultProportions = { deckHeight: 1.35, topHeight: 1.35 };

const Flatbed: FC<BodyRenderProps> = ({
  scale,
  bodyLength,
  deckHeight,
  freightSlots,
  color,
  vehicle,
}) => {
  const L = bodyLength * scale;
  const deckY = -deckHeight * scale;
  const deckThickness = 0.18 * scale;
  const headboardH = 1.5 * scale;
  const deckColor = color ?? palette.flatDeck;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Cross-bearers (underside)
  const bearerCount = 6;
  const bearers = Array.from({ length: bearerCount }, (_, i) => {
    const x = ((i + 0.5) / bearerCount) * L;
    return (
      <rect
        key={i}
        x={x - 1}
        y={deckY + deckThickness}
        width={2}
        height={0.25 * scale}
        fill={palette.chassisLight}
      />
    );
  });

  // Rope hooks
  const hookCount = Math.max(4, Math.round(bodyLength / 1.5));
  const hooks = Array.from({ length: hookCount }, (_, i) => {
    const x = ((i + 0.5) / hookCount) * L;
    return <circle key={i} cx={x} cy={deckY + deckThickness * 0.5} r={0.9} fill={palette.chassisLight} />;
  });

  return (
    <g>
      {/* Deck */}
      <rect
        x={0}
        y={deckY}
        width={L}
        height={deckThickness}
        fill={deckColor}
        stroke={palette.chassis}
        strokeWidth={0.6}
        rx={1}
      />
      {/* Deck plank suggestion */}
      <line
        x1={0}
        y1={deckY + deckThickness * 0.55}
        x2={L}
        y2={deckY + deckThickness * 0.55}
        stroke={palette.flatDeckLight}
        strokeWidth={0.4}
        opacity={0.7}
      />

      {bearers}

      {/* Headboard */}
      <rect
        x={0}
        y={deckY - headboardH}
        width={0.15 * scale}
        height={headboardH}
        fill={palette.chassisLight}
        rx={1}
      />
      <rect
        x={0}
        y={deckY - headboardH}
        width={0.6 * scale}
        height={0.08 * scale}
        fill={palette.chassisLight}
      />

      {hooks}

      <ChassisRail length={bodyLength} scale={scale} deckHeight={deckHeight - 0.15} />

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

      {/* Markers */}
      <MarkerLight x={0.4 * scale} y={deckY - headboardH + 3} />
      <MarkerLight x={L * 0.5} y={deckY + 2} />
      <MarkerLight x={L - 2} y={deckY + 2} color={palette.markerRed} />

      {/* Landing legs */}
      {hasKingpin && <LandingLegs x={2.0 * scale} deckHeight={deckHeight} scale={scale} raised />}

      {/* Mud flap at rear */}
      <MudFlap x={L - WHEEL_RADIUS_M * scale} scale={scale} deckHeight={deckHeight} />
    </g>
  );
};

export default Flatbed;
