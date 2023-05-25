import { UUID } from 'crypto';

import { PlayerEntityModel } from '@/features/player/player.entityModel';
import { ID } from '@/auth/auth.util';

export interface OwnableEntityModel {
  owner: PlayerEntityModel;
}

export type ItemRef<T> = {
  item: T;
  serviceType: any;
};

export interface Ownable<
  TargetType extends OwnableEntityModel,
  ParentType extends OwnableEntityModel,
> {
  get(id: ID): Promise<TargetType>;
  getParent(item: TargetType): Promise<ItemRef<ParentType>>;
  getOwner(item: TargetType): Promise<UUID>;
  getAllOwners(item: TargetType): Promise<UUID[]>;
}
