import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { BodyRenderProps } from '../kit/types';
import { ClosedTrailerBody, SlotTag } from '../kit/primitives';

export const defaultProportions = { deckHeight: 1.35, topHeight: 3.9 };

const BoxVan: FC<BodyRenderProps> = ({
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

  const bodyColor = color ?? palette.boxVanBlue;
  const trim = accent ?? palette.curtainTrim;
  const hasKingpin = vehicle?.attachments?.some((a) => a.kind === 'kingpin');

  // Reinforcement ribs
  const ribCount = Math.max(4, Math.round(bodyLength / 1.5));
  const ribs = Array.from({ length: ribCount }, (_, i) => {
    const x = ((i + 0.5) / ribCount) * L;
    return (
      <line
        key={i}
        x1={x}
        y1={topY + 0.2 * scale}
        x2={x}
        y2={deckY - 2}
        stroke={trim}
        strokeWidth={0.5}
        opacity={0.3}
      />
    );
  });

  // Rear roller door (horizontal slat lines)
  const slatCount = 10;
  const slats = Array.from({ length: slatCount }, (_, i) => {
    const y = topY + 0.3 * scale + (i / slatCount) * (bodyH - 0.4 * scale);
    return (
      <line
        key={i}
        x1={L - 0.55 * scale}
        y1={y}
        x2={L - 0.08 * scale}
        y2={y}
        stroke={trim}
        strokeWidth={0.4}
        opacity={0.55}
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

      {ribs}

      {/* Rear roller door frame + slats */}
      <rect
        x={L - 0.6 * scale}
        y={topY + 0.25 * scale}
        width={0.55 * scale}
        height={bodyH - 0.4 * scale}
        fill={bodyColor}
        stroke={trim}
        strokeWidth={0.6}
        opacity={0.95}
        rx={1}
      />
      {slats}
      <rect
        x={L - 0.45 * scale}
        y={topY + bodyH * 0.72}
        width={0.3 * scale}
        height={0.1 * scale}
        fill={trim}
        rx={0.5}
      />

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

export default BoxVan;
