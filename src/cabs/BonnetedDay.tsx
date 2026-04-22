import React from 'react';
import { palette } from '../kit/palette';
import { ChassisRail, MarkerLight, CabDoor, ExhaustStack } from '../kit/primitives';
import type { CabRenderProps } from '../kit/types';

const CAB_HEIGHT_M = 3.5;
const BONNET_H_M = 2.0;

const BonnetedDay: React.FC<CabRenderProps> = ({
  scale,
  cabLength,
  color = palette.cabRed,
  accent = palette.cabRedDark,
}) => {
  const L = cabLength * scale;
  const H = CAB_HEIGHT_M * scale;
  const deckY = -0.95 * scale;
  const cabBottomY = deckY - 1;

  // Bonnet in front ~1.6m, cab behind
  const bonnetW = Math.min(1.6 * scale, L * 0.45);
  const bonnetH = BONNET_H_M * scale;
  const bonnetTopY = cabBottomY - bonnetH;
  const cabTopY = -H;
  const cabStartX = bonnetW;

  const windshieldTopY = cabTopY + 4;
  const windshieldBotY = bonnetTopY + 4;

  return (
    <g>
      <ChassisRail length={cabLength} scale={scale} deckHeight={0.95} />

      {/* Bonnet — rounded top, sits in front */}
      <path
        d={`M 0 ${cabBottomY}
            L 0 ${bonnetTopY + 10}
            Q 0 ${bonnetTopY} ${12} ${bonnetTopY}
            L ${bonnetW - 4} ${bonnetTopY}
            L ${bonnetW} ${bonnetTopY + 4}
            L ${bonnetW} ${cabBottomY} Z`}
        fill={color}
        stroke={palette.cabDark}
        strokeWidth={0.8}
      />

      {/* Bonnet accent stripe along top */}
      <path
        d={`M 2 ${bonnetTopY + 2}
            Q 2 ${bonnetTopY + 1} ${12} ${bonnetTopY + 1}
            L ${bonnetW - 4} ${bonnetTopY + 1}`}
        fill="none"
        stroke={accent}
        strokeWidth={1.2}
      />

      {/* Front grille slats on the front of the bonnet */}
      <rect
        x={1}
        y={bonnetTopY + 6}
        width={8}
        height={bonnetH - 14}
        fill={accent}
        stroke={palette.cabDark}
        strokeWidth={0.4}
        rx={1}
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={1}
          x2={9}
          y1={bonnetTopY + 8 + i * (bonnetH - 18) / 4}
          y2={bonnetTopY + 8 + i * (bonnetH - 18) / 4}
          stroke={palette.cabDark}
          strokeWidth={0.5}
        />
      ))}

      {/* Round headlight on bonnet corner */}
      <circle
        cx={bonnetW * 0.35}
        cy={cabBottomY - bonnetH * 0.18}
        r={Math.min(bonnetH * 0.1, 5)}
        fill={palette.headlight}
        stroke={palette.headlightRim}
        strokeWidth={0.7}
      />

      {/* Front bumper */}
      <rect x={-1} y={cabBottomY - 4} width={bonnetW + 2} height={4} fill={palette.chassisLight} rx={1} />

      {/* Cab body behind the bonnet */}
      <rect
        x={cabStartX}
        y={cabTopY}
        width={L - cabStartX}
        height={cabBottomY - cabTopY}
        fill={color}
        stroke={palette.cabDark}
        strokeWidth={0.8}
        rx={3}
      />

      {/* Roof accent */}
      <rect x={cabStartX} y={cabTopY} width={L - cabStartX} height={3} fill={accent} rx={2} />

      {/* Angled windshield from top of cab to top of bonnet */}
      <polygon
        points={`${cabStartX + 2},${windshieldBotY} ${L - 4},${windshieldBotY} ${L - 6},${windshieldTopY} ${cabStartX + 6},${windshieldTopY}`}
        fill={palette.window}
        stroke={palette.cabDark}
        strokeWidth={0.5}
      />

      {/* Door */}
      <CabDoor x={cabStartX + (L - cabStartX) * 0.45} topY={windshieldBotY + 2} bottomY={cabBottomY - 2} />
      <rect
        x={cabStartX + (L - cabStartX) * 0.45 - 4}
        y={cabBottomY - 2}
        width={10}
        height={2}
        fill={palette.chassisLight}
        rx={0.5}
      />

      {/* Mirror off A-pillar */}
      <line x1={cabStartX + 4} y1={windshieldTopY + 4} x2={cabStartX - 3} y2={windshieldTopY + 4} stroke={palette.cabDark} strokeWidth={0.8} />
      <rect x={cabStartX - 7} y={windshieldTopY + 2} width={4} height={H * 0.18} fill={palette.cabDark} rx={0.8} />

      {/* Exhaust stack behind the cab, right side */}
      <ExhaustStack x={L - 5} scale={scale} height={3.4} />

      {/* Roof markers */}
      <MarkerLight x={cabStartX + 6} y={cabTopY + 1.5} />
      <MarkerLight x={L - 6} y={cabTopY + 1.5} />
    </g>
  );
};

export default BonnetedDay;
