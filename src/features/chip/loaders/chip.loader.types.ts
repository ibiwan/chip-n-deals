import * as DataLoader from 'dataloader';

import { ChipEntity } from '../schema';

export type ChipIdType = ChipEntity['id'];
export type ChipDataLoader = DataLoader<ChipIdType, ChipEntity>;

export type ChipOpaqueIdType = ChipEntity['opaqueId'];
export type ChipOpaqueDataLoader = DataLoader<ChipOpaqueIdType, ChipEntity>;
