import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 8.0;
const HEIGHT = 1.2;

const BulkGrain: FC<FreightRenderProps> = ({ scale, length }) => {
  const useLength = Math.min(length, NATURAL_LENGTH);
  const L = useLength * scale;
  const offsetX = ((length - useLength) * scale) / 2;
  const H = HEIGHT * scale;

  // Heap: a rounded mound with concave edges
  const peakY = -H;
  const edgeInset = L * 0.04;
  const d = `
    M ${edgeInset} 0
    Q ${L * 0.18} ${-H * 0.25}, ${L * 0.32} ${peakY + H * 0.2}
    Q ${L * 0.5} ${peakY - H * 0.05}, ${L * 0.68} ${peakY + H * 0.2}
    Q ${L * 0.82} ${-H * 0.25}, ${L - edgeInset} 0
    Z
  `;

  // Tiny dashes suggesting grain texture
  const dashes: React.ReactElement[] = [];
  const rows = 4;
  for (let r = 0; r < rows; r++) {
    const yF = 0.2 + r * 0.18;
    const y = peakY + H * yF;
    const count = 6 + r * 2;
    for (let i = 0; i < count; i++) {
      const x = L * (0.2 + (0.6 * i) / (count - 1)) + (r % 2 === 0 ? 2 : -2);
      dashes.push(
        <line
          key={`${r}-${i}`}
          x1={x}
          y1={y}
          x2={x + 2}
          y2={y}
          stroke={palette.cabDark}
          strokeWidth={0.5}
          opacity={0.4}
        />,
      );
    }
  }

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      <path d={d} fill={palette.bulkGrain} stroke={palette.chassis} strokeWidth={0.6} />
      {/* Shading */}
      <path
        d={`M ${edgeInset} 0 Q ${L * 0.18} ${-H * 0.25}, ${L * 0.32} ${peakY + H * 0.2} Q ${L * 0.5} ${peakY - H * 0.05}, ${L * 0.68} ${peakY + H * 0.2} Q ${L * 0.82} ${-H * 0.25}, ${L - edgeInset} 0`}
        fill="none"
        stroke={palette.cabWhite}
        strokeWidth={0.6}
        opacity={0.35}
      />
      {dashes}
    </g>
  );
};

export default BulkGrain;
