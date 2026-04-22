import type React from 'react';
import type { FreightType } from '../types';
import type { FreightRenderProps } from '../kit/types';

import Container20 from './Container20';
import Container40 from './Container40';
import Container20HC from './Container20HC';
import Container40HC from './Container40HC';
import PalletStack from './PalletStack';
import DrumStack from './DrumStack';
import IsoTank from './IsoTank';
import BulkGrain from './BulkGrain';
import LivestockLoad from './LivestockLoad';
import Machinery from './Machinery';
import Crate from './Crate';
import Car from './Car';
import PipeBundle from './PipeBundle';

export const FREIGHT_COMPONENTS: Record<FreightType, React.FC<FreightRenderProps>> = {
  'container-20': Container20,
  'container-40': Container40,
  'container-20-hc': Container20HC,
  'container-40-hc': Container40HC,
  'pallet-stack': PalletStack,
  'drum-stack': DrumStack,
  'iso-tank': IsoTank,
  'bulk-grain': BulkGrain,
  'livestock-load': LivestockLoad,
  'machinery': Machinery,
  'crate': Crate,
  'car': Car,
  'pipe-bundle': PipeBundle,
};

/** Fixed physical dimensions (m) for each freight type — length × height above deck. */
export const FREIGHT_DIMENSIONS: Record<FreightType, { length: number; height: number }> = {
  'container-20': { length: 6.06, height: 2.59 },
  'container-40': { length: 12.19, height: 2.59 },
  'container-20-hc': { length: 6.06, height: 2.9 },
  'container-40-hc': { length: 12.19, height: 2.9 },
  'pallet-stack': { length: 1.2, height: 1.6 },
  'drum-stack': { length: 2.4, height: 0.9 },
  'iso-tank': { length: 6.06, height: 2.45 },
  'bulk-grain': { length: 8.0, height: 1.2 },
  'livestock-load': { length: 10.0, height: 1.8 },
  machinery: { length: 7.0, height: 3.2 },
  crate: { length: 2.5, height: 1.8 },
  car: { length: 4.5, height: 1.5 },
  'pipe-bundle': { length: 11.0, height: 0.9 },
};
