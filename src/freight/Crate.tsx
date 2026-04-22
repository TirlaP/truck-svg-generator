import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 2.5;
const HEIGHT = 1.8;

const Crate: FC<FreightRenderProps> = ({ scale, length }) => {
  const useLength = Math.min(length, NATURAL_LENGTH);
  const L = useLength * scale;
  const offsetX = ((length - useLength) * scale) / 2;
  const H = HEIGHT * scale;
  const top = -H;

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      {/* Box */}
      <rect x={0} y={top} width={L} height={H} fill={palette.pallet} stroke={palette.chassis} strokeWidth={0.7} />
      {/* Planks (horizontal lines) */}
      {[0.18, 0.36, 0.54, 0.72, 0.9].map((f) => (
        <line
          key={f}
          x1={0}
          y1={top + H * f}
          x2={L}
          y2={top + H * f}
          stroke={palette.cabDark}
          strokeWidth={0.5}
          opacity={0.45}
        />
      ))}
      {/* Vertical edge planks */}
      <rect x={0} y={top} width={0.12 * scale} height={H} fill={palette.cabDark} opacity={0.35} />
      <rect x={L - 0.12 * scale} y={top} width={0.12 * scale} height={H} fill={palette.cabDark} opacity={0.35} />
      {/* Diagonal brace X */}
      <line x1={0.15 * scale} y1={top + 0.1 * scale} x2={L - 0.15 * scale} y2={-0.1 * scale} stroke={palette.cabDark} strokeWidth={1.2} opacity={0.7} />
      <line x1={L - 0.15 * scale} y1={top + 0.1 * scale} x2={0.15 * scale} y2={-0.1 * scale} stroke={palette.cabDark} strokeWidth={1.2} opacity={0.7} />
      {/* Shipping label */}
      <rect
        x={L * 0.55}
        y={top + 0.2 * scale}
        width={L * 0.3}
        height={0.4 * scale}
        fill={palette.cabWhite}
        stroke={palette.chassis}
        strokeWidth={0.5}
      />
      <line
        x1={L * 0.58}
        y1={top + 0.33 * scale}
        x2={L * 0.82}
        y2={top + 0.33 * scale}
        stroke={palette.cabDark}
        strokeWidth={0.4}
        opacity={0.6}
      />
      <line
        x1={L * 0.58}
        y1={top + 0.45 * scale}
        x2={L * 0.76}
        y2={top + 0.45 * scale}
        stroke={palette.cabDark}
        strokeWidth={0.4}
        opacity={0.6}
      />
    </g>
  );
};

export default Crate;
