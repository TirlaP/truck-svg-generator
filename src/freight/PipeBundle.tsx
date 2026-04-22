import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 11.0;
const HEIGHT = 0.9;

const PipeBundle: FC<FreightRenderProps> = ({ scale, length }) => {
  const useLength = Math.min(length, NATURAL_LENGTH);
  const L = useLength * scale;
  const offsetX = ((length - useLength) * scale) / 2;
  const H = HEIGHT * scale;

  // Stack of pipes: 5 pipes, arranged in two rows (3 bottom, 2 top) visible as circles at ends
  const pipeR = H * 0.22;
  const bottomY = -pipeR;
  const topY = -pipeR * 3;

  const bandCount = Math.max(2, Math.round(useLength / 2));
  const bands = Array.from({ length: bandCount }, (_, i) => {
    const x = (L * (i + 1)) / (bandCount + 1);
    return (
      <rect
        key={i}
        x={x - 2}
        y={topY - pipeR - 2}
        width={4}
        height={pipeR * 4 + 4}
        fill={palette.cabDark}
        opacity={0.8}
      />
    );
  });

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      {[bottomY, topY].map((y, rowIdx) => (
        <rect
          key={rowIdx}
          x={pipeR}
          y={y - pipeR}
          width={L - pipeR * 2}
          height={pipeR * 2}
          fill={palette.chassisLight}
          stroke={palette.chassis}
          strokeWidth={0.5}
        />
      ))}
      {[bottomY, topY].map((y, rowIdx) => (
        <g key={rowIdx}>
          <circle cx={pipeR} cy={y} r={pipeR} fill={palette.chassisMid} stroke={palette.chassis} strokeWidth={0.5} />
          <circle cx={pipeR} cy={y} r={pipeR * 0.55} fill={palette.cabDark} />
          <circle cx={L - pipeR} cy={y} r={pipeR} fill={palette.chassisMid} stroke={palette.chassis} strokeWidth={0.5} />
          <circle cx={L - pipeR} cy={y} r={pipeR * 0.55} fill={palette.cabDark} />
        </g>
      ))}
      {[bottomY, topY].map((y, i) => (
        <line
          key={i}
          x1={pipeR}
          y1={y - pipeR * 0.4}
          x2={L - pipeR}
          y2={y - pipeR * 0.4}
          stroke={palette.cabWhite}
          strokeWidth={0.6}
          opacity={0.35}
        />
      ))}
      {bands}
    </g>
  );
};

export default PipeBundle;
