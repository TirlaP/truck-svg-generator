import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { BodyRenderProps } from '../kit/types';
import { ClosedTrailerBody, SlotTag } from '../kit/primitives';

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

  const unitW = 1.0 * scale;
  const unitH = 0.9 * scale;

  // Faint corrugated panels for the insulated box
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
        opacity={0.6}
      />
    );
  });

  return (
    <g>
      {/* Reefer condenser unit on the front of the body, above the top edge */}
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
      <rect
        x={0.05 * scale}
        y={topY - unitH + 0.15 * scale}
        width={unitW - 0.3 * scale}
        height={0.25 * scale}
        fill={palette.reeferPanel}
        rx={1}
      />
      <line
        x1={0.05 * scale}
        y1={topY - unitH + 0.2 * scale}
        x2={unitW - 0.25 * scale}
        y2={topY - unitH + 0.2 * scale}
        stroke={trim}
        strokeWidth={0.3}
      />
      <line
        x1={0.05 * scale}
        y1={topY - unitH + 0.3 * scale}
        x2={unitW - 0.25 * scale}
        y2={topY - unitH + 0.3 * scale}
        stroke={trim}
        strokeWidth={0.3}
      />

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

      {/* Rear doors */}
      <line x1={L - 0.1 * scale} y1={topY + 2} x2={L - 0.1 * scale} y2={deckY - 2} stroke={trim} strokeWidth={0.8} />
      <line x1={L * 0.5} y1={topY + 3} x2={L * 0.5} y2={deckY - 2} stroke={trim} strokeWidth={0.4} opacity={0.5} />
      {[topY + 0.3 * scale, topY + bodyH * 0.5, deckY - 0.3 * scale].map((y, i) => (
        <rect key={i} x={L - 0.2 * scale} y={y - 1} width={0.15 * scale} height={0.15 * scale} fill={trim} />
      ))}
      <rect x={L - 0.35 * scale} y={topY + bodyH * 0.55} width={0.08 * scale} height={0.4 * scale} fill={trim} />

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

export default Refrigerated;
