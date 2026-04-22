import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 2.4;
const HEIGHT = 0.9;
const DRUM_DIAM = 0.58;

const DrumStack: FC<FreightRenderProps> = ({ scale, length }) => {
  const useLength = Math.min(length, NATURAL_LENGTH);
  const W = useLength * scale;
  const offsetX = ((length - useLength) * scale) / 2;
  const H = HEIGHT * scale;
  const d = DRUM_DIAM * scale;
  const count = Math.max(3, Math.floor(useLength / DRUM_DIAM));
  const gap = (W - count * d) / (count + 1);

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={W} height={2} fill={palette.groundShadow} />
      {Array.from({ length: count }, (_, i) => {
        const x = gap * (i + 1) + d * i;
        const cx = x + d / 2;
        const color = i % 2 === 0 ? palette.drumBlue : palette.drumRed;
        const top = -H;
        const bodyBottom = -d * 0.18;
        return (
          <g key={i}>
            {/* Body */}
            <rect x={x} y={top + d * 0.18} width={d} height={H - d * 0.18} fill={color} stroke={palette.chassis} strokeWidth={0.5} />
            {/* Bottom ellipse */}
            <ellipse cx={cx} cy={bodyBottom} rx={d / 2} ry={d * 0.18} fill={color} stroke={palette.chassis} strokeWidth={0.5} />
            {/* Top ellipse */}
            <ellipse cx={cx} cy={top + d * 0.18} rx={d / 2} ry={d * 0.18} fill={palette.cabWhite} opacity={0.9} stroke={palette.chassis} strokeWidth={0.5} />
            {/* Bungs */}
            <circle cx={cx - d * 0.15} cy={top + d * 0.18} r={d * 0.05} fill={palette.chassis} />
            <circle cx={cx + d * 0.15} cy={top + d * 0.18} r={d * 0.04} fill={palette.chassis} />
            {/* Ribs */}
            {[0.35, 0.65].map((f) => (
              <line
                key={f}
                x1={x}
                y1={top + H * f}
                x2={x + d}
                y2={top + H * f}
                stroke={palette.cabDark}
                strokeWidth={0.7}
                opacity={0.55}
              />
            ))}
            {/* Vertical highlight */}
            <line
              x1={x + d * 0.25}
              y1={top + d * 0.2}
              x2={x + d * 0.25}
              y2={-d * 0.2}
              stroke={palette.cabWhite}
              strokeWidth={0.8}
              opacity={0.35}
            />
          </g>
        );
      })}
    </g>
  );
};

export default DrumStack;
