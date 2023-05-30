import * as DataLoader from 'dataloader';

import { PlayerEntity } from '../schema';

export type PlayerIdType = PlayerEntity['id'];
export type PlayerDataByIdLoader = DataLoader<PlayerIdType, PlayerEntity>;

export type PlayerOpaqueIdType = PlayerEntity['opaqueId'];
export type PlayerDataByOpaqueIdLoader = DataLoader<
  PlayerOpaqueIdType,
  PlayerEntity
>;
