import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 4.5;
const HEIGHT = 1.5;

const Car: FC<FreightRenderProps> = ({ scale, length }) => {
  const useLength = Math.min(length, NATURAL_LENGTH);
  const L = useLength * scale;
  const offsetX = ((length - useLength) * scale) / 2;
  const H = HEIGHT * scale;

  const wheelR = 0.32 * scale;
  const wheelY = -wheelR;
  const frontWheelX = L * 0.22;
  const rearWheelX = L * 0.78;

  const bodyBottomY = -0.35 * scale;
  const beltLineY = -H * 0.6;
  const roofY = -H;

  // Silhouette path: lower body + curved roof
  const d = `
    M ${L * 0.04} ${bodyBottomY}
    Q ${L * 0.02} ${-H * 0.45}, ${L * 0.1} ${-H * 0.5}
    Q ${L * 0.2} ${-H * 0.55}, ${L * 0.3} ${beltLineY}
    Q ${L * 0.42} ${roofY + 2}, ${L * 0.55} ${roofY}
    Q ${L * 0.7} ${roofY + 2}, ${L * 0.78} ${beltLineY}
    Q ${L * 0.9} ${-H * 0.55}, ${L * 0.96} ${-H * 0.45}
    Q ${L * 0.98} ${-H * 0.3}, ${L * 0.98} ${bodyBottomY}
    Z
  `;

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      {/* Body */}
      <path d={d} fill={palette.carBody} stroke={palette.chassis} strokeWidth={0.7} />
      {/* Windshield + rear glass + side window (split by B-pillar) */}
      <path
        d={`M ${L * 0.33} ${beltLineY + 2} Q ${L * 0.42} ${roofY + 4}, ${L * 0.5} ${roofY + 4} L ${L * 0.5} ${beltLineY + 2} Z`}
        fill={palette.window}
        stroke={palette.chassis}
        strokeWidth={0.4}
      />
      <path
        d={`M ${L * 0.52} ${roofY + 4} Q ${L * 0.6} ${roofY + 4}, ${L * 0.75} ${beltLineY + 2} L ${L * 0.52} ${beltLineY + 2} Z`}
        fill={palette.window}
        stroke={palette.chassis}
        strokeWidth={0.4}
      />
      {/* Door line */}
      <line x1={L * 0.5} y1={beltLineY + 2} x2={L * 0.5} y2={bodyBottomY} stroke={palette.chassis} strokeWidth={0.4} opacity={0.5} />
      {/* Headlight & tail */}
      <rect x={L * 0.93} y={-H * 0.35} width={0.2 * scale} height={0.1 * scale} fill={palette.headlight} />
      <rect x={L * 0.03} y={-H * 0.35} width={0.15 * scale} height={0.1 * scale} fill={palette.markerRed} />
      {/* Wheels */}
      {[frontWheelX, rearWheelX].map((wx, i) => (
        <g key={i}>
          <circle cx={wx} cy={wheelY} r={wheelR} fill={palette.tyre} stroke={palette.tyreOutline} strokeWidth={0.5} />
          <circle cx={wx} cy={wheelY} r={wheelR * 0.45} fill={palette.rim} />
          <circle cx={wx} cy={wheelY} r={wheelR * 0.18} fill={palette.rimDark} />
        </g>
      ))}
      {/* Wheel arches */}
      <circle cx={frontWheelX} cy={wheelY} r={wheelR * 1.25} fill="none" stroke={palette.chassis} strokeWidth={0.6} />
      <circle cx={rearWheelX} cy={wheelY} r={wheelR * 1.25} fill="none" stroke={palette.chassis} strokeWidth={0.6} />
    </g>
  );
};

export default Car;
