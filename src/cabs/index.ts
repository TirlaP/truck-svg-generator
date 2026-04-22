import React from 'react';
import type { CabType } from '../types';
import type { CabRenderProps } from '../kit/types';

import CabOverDay from './CabOverDay';
import CabOverSleeper from './CabOverSleeper';
import BonnetedDay from './BonnetedDay';
import BonnetedSleeper from './BonnetedSleeper';
import LightCabOver from './LightCabOver';

export const CAB_COMPONENTS: Record<CabType, React.FC<CabRenderProps>> = {
  'cab-over-day': CabOverDay,
  'cab-over-sleeper': CabOverSleeper,
  'bonneted-day': BonnetedDay,
  'bonneted-sleeper': BonnetedSleeper,
  'light-cab-over': LightCabOver,
};

export const CAB_DEFAULT_LENGTH: Record<CabType, number> = {
  'cab-over-day': 2.4,
  'cab-over-sleeper': 3.4,
  'bonneted-day': 4.0,
  'bonneted-sleeper': 5.4,
  'light-cab-over': 2.2,
};

export const CAB_HEIGHT: Record<CabType, number> = {
  'cab-over-day': 3.8,
  'cab-over-sleeper': 3.9,
  'bonneted-day': 3.5,
  'bonneted-sleeper': 3.7,
  'light-cab-over': 2.5,
};

export { CabOverDay, CabOverSleeper, BonnetedDay, BonnetedSleeper, LightCabOver };
