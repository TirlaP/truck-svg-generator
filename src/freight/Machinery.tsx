import type { FC } from 'react';
import { palette } from '../kit/palette';
import type { FreightRenderProps } from '../kit/types';

const NATURAL_LENGTH = 7.0;
const HEIGHT = 3.2;

const Machinery: FC<FreightRenderProps> = ({ scale, length }) => {
  const useLength = Math.min(length, NATURAL_LENGTH);
  const L = useLength * scale;
  const offsetX = ((length - useLength) * scale) / 2;
  const H = HEIGHT * scale;

  const trackL = 3.5 * (L / NATURAL_LENGTH / scale) * scale; // ~ scaled
  const trackH = 0.7 * scale;
  const trackY = -trackH;
  const trackX = 0.3 * scale;
  const trackWidth = L - 0.6 * scale;

  const cabW = 1.8 * scale;
  const cabH = 1.5 * scale;
  const cabX = trackX + 0.3 * scale;
  const cabY = -trackH - cabH;

  // Boom arm: base near cab, bent up and forward toward rear
  const boomBaseX = cabX + cabW;
  const boomBaseY = trackY - 0.2 * scale;
  const elbowX = boomBaseX + 2.2 * scale;
  const elbowY = -H + 0.2 * scale;
  const tipX = elbowX + 1.5 * scale;
  const tipY = -H * 0.55;
  void trackL;

  return (
    <g transform={`translate(${offsetX}, 0)`}>
      <rect x={0} y={-1} width={L} height={2} fill={palette.groundShadow} />
      {/* Tracks */}
      <rect x={trackX} y={trackY} width={trackWidth} height={trackH} fill={palette.cabDark} rx={trackH * 0.4} />
      {/* Track wheels */}
      {[0.08, 0.3, 0.5, 0.7, 0.92].map((f) => (
        <circle
          key={f}
          cx={trackX + trackWidth * f}
          cy={trackY + trackH * 0.55}
          r={trackH * 0.32}
          fill={palette.chassisLight}
          stroke={palette.cabDark}
          strokeWidth={0.5}
        />
      ))}
      {/* Track treads (tiny dashes) */}
      {Array.from({ length: 14 }, (_, i) => (
        <line
          key={i}
          x1={trackX + (trackWidth * i) / 14 + 2}
          y1={trackY + trackH - 1}
          x2={trackX + (trackWidth * i) / 14 + 4}
          y2={trackY + trackH - 1}
          stroke={palette.chassisLight}
          strokeWidth={0.6}
        />
      ))}
      {/* Cab body */}
      <rect x={cabX} y={cabY} width={cabW} height={cabH} fill={palette.tipperYellow} stroke={palette.chassis} strokeWidth={0.7} rx={2} />
      {/* Cab window */}
      <rect x={cabX + 0.2 * scale} y={cabY + 0.2 * scale} width={cabW - 0.4 * scale} height={cabH * 0.55} fill={palette.window} stroke={palette.chassis} strokeWidth={0.5} />
      {/* Counterweight (left hump) */}
      <rect x={trackX + 0.1 * scale} y={cabY + cabH * 0.35} width={cabX - trackX - 0.1 * scale} height={cabH * 0.65} fill={palette.tipperYellowDark} stroke={palette.chassis} strokeWidth={0.6} rx={2} />
      {/* Boom */}
      <polyline
        points={`${boomBaseX},${boomBaseY} ${elbowX},${elbowY} ${tipX},${tipY}`}
        fill="none"
        stroke={palette.tipperYellow}
        strokeWidth={0.4 * scale}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points={`${boomBaseX},${boomBaseY} ${elbowX},${elbowY} ${tipX},${tipY}`}
        fill="none"
        stroke={palette.chassis}
        strokeWidth={0.6}
      />
      {/* Bucket at tip */}
      <path
        d={`M ${tipX - 0.2 * scale} ${tipY} L ${tipX + 0.5 * scale} ${tipY + 0.1 * scale} L ${tipX + 0.4 * scale} ${tipY + 0.6 * scale} L ${tipX - 0.1 * scale} ${tipY + 0.5 * scale} Z`}
        fill={palette.tipperYellowDark}
        stroke={palette.chassis}
        strokeWidth={0.6}
      />
    </g>
  );
};

export default Machinery;
