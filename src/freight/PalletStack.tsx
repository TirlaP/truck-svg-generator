import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 1.2;
const HEIGHT = 1.6;

const PalletStack: FC<FreightRenderProps> = ({ scale, length }) => {
  const W = Math.min(length, NATURAL_LENGTH) * scale;
  const offsetX = ((length - Math.min(length, NATURAL_LENGTH)) * scale) / 2;
  const H = HEIGHT * scale;
  const palletH = 0.14 * scale;
  const wrapTop = -H;
  const wrapBottom = -palletH;

  // Hatch pattern as stripes in a pattern
  const hatchLines = [];
  for (let i = -W; i < W * 2; i += 0.25 * scale) {
    hatchLines.push(
      <line
        key={i}
        x1={i}
        y1={wrapBottom}
        x2={i + H}
        y2={wrapTop}
        stroke={palette.cabWhite}
        strokeWidth={0.3}
        opacity={0.35}
      />,
    );
  }

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={W} height={2} fill={palette.groundShadow} />
      {/* Wooden pallet base */}
      <rect x={0} y={-palletH} width={W} height={palletH} fill={palette.pallet} stroke={palette.chassis} strokeWidth={0.4} />
      {/* Pallet board gaps */}
      {[0.2, 0.5, 0.8].map((f) => (
        <rect key={f} x={W * f - 1} y={-palletH + 1} width={2} height={palletH - 2} fill={palette.cabDark} opacity={0.4} />
      ))}
      {/* Shrink wrapped goods */}
      <clipPath id="palletWrapClip">
        <rect x={2} y={wrapTop} width={W - 4} height={H - palletH} />
      </clipPath>
      <rect
        x={2}
        y={wrapTop}
        width={W - 4}
        height={H - palletH}
        fill={palette.palletWrap}
        fillOpacity={0.6}
        stroke={palette.chassis}
        strokeWidth={0.5}
      />
      <g clipPath="url(#palletWrapClip)">{hatchLines}</g>
      {/* Horizontal tier lines suggesting stacked boxes inside */}
      {[0.33, 0.66].map((f) => (
        <line
          key={f}
          x1={2}
          y1={wrapTop + (H - palletH) * f}
          x2={W - 2}
          y2={wrapTop + (H - palletH) * f}
          stroke={palette.cabDark}
          strokeWidth={0.4}
          opacity={0.25}
        />
      ))}
    </g>
  );
};

export default PalletStack;
