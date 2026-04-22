import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 10.0;
const HEIGHT = 1.8;

// Hereford-style side-profile cow. Origin = rear-bottom of hooves.
function Cow({ x, y, s, patchSeed }: { x: number; y: number; s: number; patchSeed: number }) {
  const dark = palette.cabDark;
  const light = palette.cabWhite;
  const pink = palette.cabRed;
  const bodyW = 1.55;
  const bodyH = 0.85;
  const legH = 0.55;
  const hW = 0.55;
  const hH = 0.55;
  const px = 0.28 + (patchSeed % 3) * 0.12;
  const legX = [0.1, 0.24, 0.76, 0.9];

  return (
    <g transform={`translate(${x}, ${y})`}>
      {legX.map((f, i) => (
        <g key={i}>
          <rect x={bodyW * f * s} y={-legH * s} width={0.15 * s} height={legH * s} fill={dark} />
          <rect x={bodyW * f * s} y={-0.08 * s} width={0.15 * s} height={0.08 * s} fill={palette.chassis} />
        </g>
      ))}
      {/* Body */}
      <rect x={0} y={-(legH + bodyH) * s} width={bodyW * s} height={bodyH * s} fill={dark} rx={0.25 * s} ry={0.25 * s} />
      {/* Hereford side patch */}
      <rect x={px * s} y={-(legH + bodyH * 0.6) * s} width={0.75 * s} height={bodyH * 0.55 * s} fill={light} rx={0.12 * s} ry={0.12 * s} />
      {/* Shoulder hump */}
      <rect x={bodyW * 0.6 * s} y={-(legH + bodyH * 1.02) * s} width={0.35 * s} height={0.15 * s} fill={dark} rx={0.08 * s} ry={0.08 * s} />
      {/* Tail */}
      <path
        d={`M ${0.02 * s} ${-(legH + bodyH * 0.9) * s} Q ${-0.1 * s} ${-(legH + bodyH * 0.55) * s}, ${-0.14 * s} ${-(legH + bodyH * 0.2) * s} L ${-0.04 * s} ${-(legH + bodyH * 0.2) * s} Q ${-0.02 * s} ${-(legH + bodyH * 0.55) * s}, ${0.1 * s} ${-(legH + bodyH * 0.82) * s} Z`}
        fill={dark}
      />
      {/* Head group */}
      <g transform={`translate(${bodyW * s}, ${-(legH + bodyH * 0.6) * s})`}>
        <path d={`M ${-0.1 * s} ${-0.15 * s} L ${0.08 * s} ${-0.25 * s} L ${0.15 * s} ${0.3 * s} L ${-0.08 * s} ${0.25 * s} Z`} fill={dark} />
        <rect x={0.05 * s} y={-hH * 0.75 * s} width={hW * s} height={hH * s} fill={light} rx={0.14 * s} ry={0.14 * s} stroke={dark} strokeWidth={0.04 * s} />
        <path d={`M ${0.08 * s} ${-hH * 0.7 * s} L ${0.3 * s} ${-hH * 0.9 * s} L ${0.25 * s} ${-hH * 0.45 * s} Z`} fill={dark} opacity={0.55} />
        <path d={`M ${0.08 * s} ${-hH * 0.78 * s} L ${-0.02 * s} ${-hH * 1.05 * s} L ${0.2 * s} ${-hH * 0.82 * s} Z`} fill={dark} />
        <path d={`M ${0.18 * s} ${-hH * 0.88 * s} L ${0.12 * s} ${-hH * 1.12 * s} L ${0.24 * s} ${-hH * 0.92 * s} Z`} fill={light} stroke={dark} strokeWidth={0.025 * s} />
        <circle cx={0.36 * s} cy={-hH * 0.4 * s} r={0.05 * s} fill={palette.chassis} />
        <ellipse cx={0.54 * s} cy={-hH * 0.1 * s} rx={0.11 * s} ry={0.09 * s} fill={pink} opacity={0.85} stroke={dark} strokeWidth={0.02 * s} />
        <circle cx={0.56 * s} cy={-hH * 0.12 * s} r={0.022 * s} fill={palette.chassis} />
      </g>
    </g>
  );
}

const LivestockLoad: FC<FreightRenderProps> = ({ scale, length }) => {
  const useLength = Math.min(length, NATURAL_LENGTH);
  const L = useLength * scale;
  const offsetX = ((length - useLength) * scale) / 2;
  const H = HEIGHT * scale;
  const cowCount = 5;
  const pitch = (useLength - 1.95) / (cowCount - 1);

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      {/* Interior backdrop */}
      <rect x={0} y={-H} width={L} height={H} fill={palette.livestockWood} opacity={0.25} />
      {/* Crate floor */}
      <rect x={0} y={-0.15 * scale} width={L} height={0.15 * scale} fill={palette.livestockWood} />
      {/* Corner posts */}
      <rect x={0} y={-H} width={0.18 * scale} height={H} fill={palette.livestockWood} />
      <rect x={L - 0.18 * scale} y={-H} width={0.18 * scale} height={H} fill={palette.livestockWood} />
      {/* Top rail */}
      <rect x={0} y={-H} width={L} height={0.18 * scale} fill={palette.livestockWood} />
      <rect x={0} y={-H + 0.02 * scale} width={L} height={0.04 * scale} fill={palette.livestockSlat} opacity={0.7} />
      {/* Cattle */}
      {Array.from({ length: cowCount }, (_, i) => (
        <Cow key={i} x={(0.2 + i * pitch) * scale} y={-0.08 * scale + (i % 2) * 0.04 * scale} s={scale} patchSeed={i} />
      ))}
      {/* Horizontal slat vents */}
      {Array.from({ length: 6 }, (_, i) => {
        const f = (i + 0.5) / 6;
        const y = -H + 0.22 * scale + (H - 0.35 * scale) * f;
        const op = f < 0.4 ? 0.38 : 0.6;
        return <rect key={i} x={0.15 * scale} y={y} width={L - 0.3 * scale} height={0.08 * scale} fill={palette.livestockWood} opacity={op} />;
      })}
      {/* Kick rail */}
      <rect x={0.15 * scale} y={-0.3 * scale} width={L - 0.3 * scale} height={0.08 * scale} fill={palette.livestockWood} opacity={0.9} />
    </g>
  );
};

export default LivestockLoad;
