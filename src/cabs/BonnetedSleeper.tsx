import React from 'react';
import { palette } from '../kit/palette';
import { ChassisRail, MarkerLight, CabDoor, ExhaustStack } from '../kit/primitives';
import type { CabRenderProps } from '../kit/types';

const CAB_HEIGHT_M = 3.7;
const BONNET_H_M = 2.2;

const BonnetedSleeper: React.FC<CabRenderProps> = ({
  scale,
  cabLength,
  color = palette.cabRed,
  accent = palette.cabRedDark,
}) => {
  const L = cabLength * scale;
  const H = CAB_HEIGHT_M * scale;
  const deckY = -0.95 * scale;
  const cabBottomY = deckY - 1;

  // Long bonnet ~2.0m, sleeper-cab behind
  const bonnetW = Math.min(2.0 * scale, L * 0.4);
  const bonnetH = BONNET_H_M * scale;
  const bonnetTopY = cabBottomY - bonnetH;
  const cabTopY = -H;
  const cabStartX = bonnetW;
  const cabW = L - cabStartX;

  // Front section (door area) vs sleeper section
  const frontW = cabW * 0.45;
  const sleeperStartX = cabStartX + frontW;

  const windshieldTopY = cabTopY + 5;
  const windshieldBotY = bonnetTopY + 5;

  return (
    <g>
      <ChassisRail length={cabLength} scale={scale} deckHeight={0.95} />

      {/* Long bonnet with rounded top */}
      <path
        d={`M 0 ${cabBottomY}
            L 0 ${bonnetTopY + 12}
            Q 0 ${bonnetTopY} ${14} ${bonnetTopY}
            L ${bonnetW - 6} ${bonnetTopY}
            L ${bonnetW} ${bonnetTopY + 6}
            L ${bonnetW} ${cabBottomY} Z`}
        fill={color}
        stroke={palette.cabDark}
        strokeWidth={0.8}
      />

      {/* Bonnet accent stripe */}
      <path
        d={`M 3 ${bonnetTopY + 2}
            Q 3 ${bonnetTopY + 1} ${14} ${bonnetTopY + 1}
            L ${bonnetW - 6} ${bonnetTopY + 1}`}
        fill="none"
        stroke={accent}
        strokeWidth={1.2}
      />

      {/* Air intake suggested on side of bonnet */}
      <rect
        x={bonnetW * 0.55}
        y={bonnetTopY + bonnetH * 0.35}
        width={bonnetW * 0.35}
        height={bonnetH * 0.12}
        fill={accent}
        stroke={palette.cabDark}
        strokeWidth={0.4}
        rx={1}
      />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={bonnetW * 0.57 + i * 6}
          x2={bonnetW * 0.57 + i * 6}
          y1={bonnetTopY + bonnetH * 0.37}
          y2={bonnetTopY + bonnetH * 0.45}
          stroke={palette.cabDark}
          strokeWidth={0.4}
        />
      ))}

      {/* Front grille slats */}
      <rect
        x={1}
        y={bonnetTopY + 8}
        width={10}
        height={bonnetH - 18}
        fill={accent}
        stroke={palette.cabDark}
        strokeWidth={0.4}
        rx={1}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <line
          key={i}
          x1={1}
          x2={11}
          y1={bonnetTopY + 10 + i * (bonnetH - 22) / 5}
          y2={bonnetTopY + 10 + i * (bonnetH - 22) / 5}
          stroke={palette.cabDark}
          strokeWidth={0.5}
        />
      ))}

      {/* Round headlight */}
      <circle
        cx={bonnetW * 0.32}
        cy={cabBottomY - bonnetH * 0.2}
        r={Math.min(bonnetH * 0.11, 6)}
        fill={palette.headlight}
        stroke={palette.headlightRim}
        strokeWidth={0.7}
      />
      {/* Second smaller marker/fog light */}
      <circle
        cx={bonnetW * 0.52}
        cy={cabBottomY - bonnetH * 0.14}
        r={Math.min(bonnetH * 0.06, 3)}
        fill={palette.headlight}
        stroke={palette.headlightRim}
        strokeWidth={0.5}
      />

      {/* Front bumper — chunky */}
      <rect x={-1} y={cabBottomY - 5} width={bonnetW + 2} height={5} fill={palette.chassisLight} stroke={palette.cabDark} strokeWidth={0.4} rx={1} />

      {/* Cab body — tall sleeper */}
      <rect
        x={cabStartX}
        y={cabTopY}
        width={cabW}
        height={cabBottomY - cabTopY}
        fill={color}
        stroke={palette.cabDark}
        strokeWidth={0.8}
        rx={3}
      />

      {/* Roof accent */}
      <rect x={cabStartX} y={cabTopY} width={cabW} height={3} fill={accent} rx={2} />

      {/* Angled windshield on front portion only */}
      <polygon
        points={`${cabStartX + 2},${windshieldBotY} ${sleeperStartX - 2},${windshieldBotY} ${sleeperStartX - 4},${windshieldTopY} ${cabStartX + 6},${windshieldTopY}`}
        fill={palette.window}
        stroke={palette.cabDark}
        strokeWidth={0.5}
      />

      {/* Sleeper divider */}
      <line x1={sleeperStartX} y1={cabTopY + 4} x2={sleeperStartX} y2={cabBottomY - 3} stroke={palette.cabDark} strokeWidth={0.5} />

      {/* Sleeper porthole */}
      <circle
        cx={sleeperStartX + (L - sleeperStartX) * 0.5}
        cy={cabTopY + H * 0.3}
        r={Math.min(H * 0.09, 7)}
        fill={palette.window}
        stroke={palette.cabDark}
        strokeWidth={0.6}
      />

      {/* Door */}
      <CabDoor x={cabStartX + frontW * 0.5} topY={windshieldBotY + 2} bottomY={cabBottomY - 2} />
      <rect x={cabStartX + frontW * 0.5 - 4} y={cabBottomY - 2} width={10} height={2} fill={palette.chassisLight} rx={0.5} />

      {/* Mirror */}
      <line x1={cabStartX + 4} y1={windshieldTopY + 4} x2={cabStartX - 3} y2={windshieldTopY + 4} stroke={palette.cabDark} strokeWidth={0.8} />
      <rect x={cabStartX - 7} y={windshieldTopY + 2} width={4} height={H * 0.2} fill={palette.cabDark} rx={0.8} />

      {/* Double exhaust stacks behind cab */}
      <ExhaustStack x={L - 4} scale={scale} height={3.8} />
      <ExhaustStack x={L - 12} scale={scale} height={3.8} />

      {/* Roof markers */}
      <MarkerLight x={cabStartX + 6} y={cabTopY + 1.5} />
      <MarkerLight x={cabStartX + cabW * 0.5} y={cabTopY + 1.5} />
      <MarkerLight x={L - 6} y={cabTopY + 1.5} />
    </g>
  );
};

export default BonnetedSleeper;
