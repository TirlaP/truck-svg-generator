import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 10.0;
const HEIGHT = 1.8;

// Simple cow silhouette (back + head peering). All coords in metres, scaled externally.
function Cow({ x, y, scale, flip }: { x: number; y: number; scale: number; flip?: boolean }) {
  const s = scale;
  // origin at back-left of the cow "back line"
  const body = `
    M 0 0
    Q ${0.2 * s} ${-0.25 * s}, ${0.6 * s} ${-0.3 * s}
    L ${1.2 * s} ${-0.3 * s}
    Q ${1.5 * s} ${-0.28 * s}, ${1.55 * s} ${-0.15 * s}
    L ${1.7 * s} ${-0.4 * s}
    Q ${1.85 * s} ${-0.55 * s}, ${1.75 * s} ${-0.6 * s}
    Q ${1.55 * s} ${-0.55 * s}, ${1.5 * s} ${-0.35 * s}
    L ${0.2 * s} ${-0.35 * s}
    Z
  `;
  return (
    <g transform={`translate(${x}, ${y}) ${flip ? 'scale(-1,1)' : ''}`}>
      <path d={body} fill={palette.cabDark} opacity={0.85} />
      {/* Ear */}
      <circle cx={1.65 * s} cy={-0.5 * s} r={0.04 * s} fill={palette.cabDark} />
    </g>
  );
}

const LivestockLoad: FC<FreightRenderProps> = ({ scale, length }) => {
  const useLength = Math.min(length, NATURAL_LENGTH);
  const L = useLength * scale;
  const offsetX = ((length - useLength) * scale) / 2;
  const H = HEIGHT * scale;

  // 4-5 cows peeking over slats
  const cowCount = Math.max(4, Math.floor(useLength / 2.2));
  const cows = Array.from({ length: cowCount }, (_, i) => {
    const xF = (i + 0.5) / cowCount;
    const x = xF * L - 0.9 * scale;
    const yJitter = (i % 2 === 0 ? -0.05 : 0.05) * scale;
    return <Cow key={i} x={x} y={-H * 0.55 + yJitter} scale={scale} flip={i % 3 === 0} />;
  });

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      {/* Slat shadow band — suggests cattle deck floor */}
      <rect x={0} y={-0.2 * scale} width={L} height={0.2 * scale} fill={palette.livestockWood} opacity={0.6} />
      {cows}
      {/* Vertical slats in front of cows */}
      {Array.from({ length: Math.round(useLength * 2) }, (_, i) => {
        const x = (i + 0.5) * (L / Math.round(useLength * 2));
        return (
          <line
            key={i}
            x1={x}
            y1={-H}
            x2={x}
            y2={-0.1 * scale}
            stroke={palette.livestockSlat}
            strokeWidth={1}
            opacity={0.75}
          />
        );
      })}
    </g>
  );
};

export default LivestockLoad;
