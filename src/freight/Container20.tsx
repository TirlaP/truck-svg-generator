import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 6.06;
const HEIGHT = 2.59;

const Container20: FC<FreightRenderProps> = ({ scale, length }) => {
  const L = Math.min(length, NATURAL_LENGTH) * scale;
  const offsetX = ((length - Math.min(length, NATURAL_LENGTH)) * scale) / 2;
  const H = HEIGHT * scale;
  const top = -H;
  const corr = 18;
  const corrStep = L / corr;

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      {/* Shadow */}
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      {/* Body */}
      <rect
        x={0}
        y={top}
        width={L}
        height={H}
        fill={palette.container20}
        stroke={palette.chassis}
        strokeWidth={0.8}
      />
      {/* Corrugations */}
      {Array.from({ length: corr - 1 }, (_, i) => (
        <line
          key={i}
          x1={(i + 1) * corrStep}
          y1={top + 3}
          x2={(i + 1) * corrStep}
          y2={-3}
          stroke={palette.cabDark}
          strokeWidth={0.4}
          opacity={0.35}
        />
      ))}
      {/* Top & bottom rails */}
      <rect x={0} y={top} width={L} height={0.15 * scale} fill={palette.cabDark} opacity={0.55} />
      <rect x={0} y={-0.15 * scale} width={L} height={0.15 * scale} fill={palette.cabDark} opacity={0.55} />
      {/* Corner castings */}
      {[
        [0, top],
        [L - 0.25 * scale, top],
        [0, -0.25 * scale],
        [L - 0.25 * scale, -0.25 * scale],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={0.25 * scale} height={0.25 * scale} fill={palette.chassis} />
      ))}
      {/* Rear door line + hinge detail */}
      <line
        x1={L - 0.1 * scale}
        y1={top + 0.25 * scale}
        x2={L - 0.1 * scale}
        y2={-0.25 * scale}
        stroke={palette.cabDark}
        strokeWidth={0.6}
        opacity={0.7}
      />
      <line
        x1={L * 0.5}
        y1={top + 0.25 * scale}
        x2={L * 0.5}
        y2={-0.25 * scale}
        stroke={palette.cabDark}
        strokeWidth={0.3}
        opacity={0.25}
      />
    </g>
  );
};

export default Container20;
