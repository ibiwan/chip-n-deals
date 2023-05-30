import * as DataLoader from 'dataloader';

import { ChipSetEntity } from '../schema';

export type ChipSetIdType = ChipSetEntity['id'];
export type ChipSetDataLoader = DataLoader<ChipSetIdType, ChipSetEntity>;

export type ChipSetOpaqueIdType = ChipSetEntity['opaqueId'];
export type ChipSetOpaqueDataLoader = DataLoader<
  ChipSetOpaqueIdType,
  ChipSetEntity
>;
