import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 6.06;
const HEIGHT = 2.45;

const IsoTank: FC<FreightRenderProps> = ({ scale, length }) => {
  const L = Math.min(length, NATURAL_LENGTH) * scale;
  const offsetX = ((length - Math.min(length, NATURAL_LENGTH)) * scale) / 2;
  const H = HEIGHT * scale;
  const top = -H;
  const cornerSize = 0.25 * scale;
  const frameStroke = 0.8;
  // Cylinder capsule inside frame
  const tankInset = 0.35 * scale;
  const tankY = top + tankInset * 0.6;
  const tankH = H - tankInset * 1.2;
  const tankX = tankInset;
  const tankW = L - tankInset * 2;
  const r = tankH / 2;

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      {/* Frame outline */}
      <rect x={0} y={top} width={L} height={H} fill="none" stroke={palette.chassis} strokeWidth={frameStroke} />
      {/* Top & bottom rails */}
      <rect x={0} y={top} width={L} height={0.12 * scale} fill={palette.chassis} />
      <rect x={0} y={-0.12 * scale} width={L} height={0.12 * scale} fill={palette.chassis} />
      {/* Corner castings */}
      {[
        [0, top],
        [L - cornerSize, top],
        [0, -cornerSize],
        [L - cornerSize, -cornerSize],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={cornerSize} height={cornerSize} fill={palette.cabDark} />
      ))}
      {/* Cylinder (capsule) */}
      <rect
        x={tankX + r}
        y={tankY}
        width={tankW - r * 2}
        height={tankH}
        fill={palette.isoTankSilver}
        stroke={palette.chassis}
        strokeWidth={0.7}
      />
      <circle cx={tankX + r} cy={tankY + r} r={r} fill={palette.isoTankSilver} stroke={palette.chassis} strokeWidth={0.7} />
      <circle cx={tankX + tankW - r} cy={tankY + r} r={r} fill={palette.isoTankSilver} stroke={palette.chassis} strokeWidth={0.7} />
      {/* Equator band */}
      <line
        x1={tankX + r * 0.3}
        y1={tankY + r}
        x2={tankX + tankW - r * 0.3}
        y2={tankY + r}
        stroke={palette.tankerBand}
        strokeWidth={0.6}
        opacity={0.7}
      />
      {/* Manhole dome */}
      <rect
        x={tankX + tankW * 0.35}
        y={tankY - 0.18 * scale}
        width={0.5 * scale}
        height={0.2 * scale}
        fill={palette.tankerTrim}
        rx={2}
      />
      <rect x={tankX + tankW * 0.42} y={tankY - 0.3 * scale} width={0.3 * scale} height={0.15 * scale} fill={palette.tankerTrim} rx={2} />
      {/* Discharge valve at rear */}
      <rect x={tankX + tankW - 0.1 * scale} y={tankY + r - 0.05 * scale} width={0.25 * scale} height={0.25 * scale} fill={palette.tankerTrim} />
    </g>
  );
};

export default IsoTank;
