import type React from 'react';
import type { BodyType } from '../types';
import type { BodyRenderProps } from '../kit/types';

import Flatbed, { defaultProportions as flatbedDefaults } from './Flatbed';
import CurtainSider, { defaultProportions as curtainSiderDefaults } from './CurtainSider';
import Refrigerated, { defaultProportions as refrigeratedDefaults } from './Refrigerated';
import Tanker, { defaultProportions as tankerDefaults } from './Tanker';
import Tipper, { defaultProportions as tipperDefaults } from './Tipper';
import Skeletal, { defaultProportions as skeletalDefaults } from './Skeletal';
import Livestock, { defaultProportions as livestockDefaults } from './Livestock';
import BoxVan, { defaultProportions as boxVanDefaults } from './BoxVan';
import DropDeck, { defaultProportions as dropDeckDefaults } from './DropDeck';
import LowLoader, { defaultProportions as lowLoaderDefaults } from './LowLoader';
import CarCarrier, { defaultProportions as carCarrierDefaults } from './CarCarrier';

export const BODY_COMPONENTS: Record<BodyType, React.FC<BodyRenderProps>> = {
  flatbed: Flatbed,
  'curtain-sider': CurtainSider,
  refrigerated: Refrigerated,
  tanker: Tanker,
  tipper: Tipper,
  skeletal: Skeletal,
  livestock: Livestock,
  'box-van': BoxVan,
  'drop-deck': DropDeck,
  'low-loader': LowLoader,
  'car-carrier': CarCarrier,
};

export const BODY_DEFAULTS: Record<BodyType, { deckHeight: number; topHeight: number }> = {
  flatbed: flatbedDefaults,
  'curtain-sider': curtainSiderDefaults,
  refrigerated: refrigeratedDefaults,
  tanker: tankerDefaults,
  tipper: tipperDefaults,
  skeletal: skeletalDefaults,
  livestock: livestockDefaults,
  'box-van': boxVanDefaults,
  'drop-deck': dropDeckDefaults,
  'low-loader': lowLoaderDefaults,
  'car-carrier': carCarrierDefaults,
};
