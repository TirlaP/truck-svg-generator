import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { BodyRenderProps } from '../kit/types';
import { ClosedTrailerBody, SlotTag } from '../kit/primitives';

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

  const bodyColor = color ?? palette.curtainGreen;
  const trim = accent ?? palette.curtainTrim;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Tensioning straps across the curtain — subtle, evenly spaced
  const strapSpacing = 1.2;
  const strapCount = Math.max(3, Math.floor(bodyLength / strapSpacing));
  const straps = Array.from({ length: strapCount }, (_, i) => {
    const x = ((i + 1) / (strapCount + 1)) * L;
    return (
      <line
        key={i}
        x1={x}
        y1={topY + 0.2 * scale}
        x2={x}
        y2={deckY - 1}
        stroke={trim}
        strokeWidth={0.5}
        opacity={0.5}
      />
    );
  });

  return (
    <g>
      <ClosedTrailerBody
        scale={scale}
        bodyLength={bodyLength}
        deckHeight={deckHeight}
        topHeight={topHeight}
        color={bodyColor}
        trim={trim}
        hasKingpin={hasKingpin}
      />

      {/* Curtain detail: vertical tensioning straps and two faint horizontal canvas lines */}
      <line x1={2} y1={topY + bodyH * 0.38} x2={L - 2} y2={topY + bodyH * 0.38} stroke={trim} strokeWidth={0.3} opacity={0.25} />
      <line x1={2} y1={topY + bodyH * 0.72} x2={L - 2} y2={topY + bodyH * 0.72} stroke={trim} strokeWidth={0.3} opacity={0.25} />
      {straps}

      {/* Front vertical post + rear door frame */}
      <rect x={0} y={topY} width={0.15 * scale} height={bodyH} fill={trim} />
      <rect x={L - 0.18 * scale} y={topY} width={0.18 * scale} height={bodyH} fill={trim} />

      {/* Slot tags above the body so the user can identify positions without
          rendering full-height interior rectangles. */}
      {freightSlots?.map((slot, i) => (
        <SlotTag
          key={i}
          x={(slot.start + slot.length / 2) * scale}
          y={topY - 12}
          label={slot.label}
          loaded={slot.loaded}
        />
      ))}
    </g>
  );
};

export default CurtainSider;
