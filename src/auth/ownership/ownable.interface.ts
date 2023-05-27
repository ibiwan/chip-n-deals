import { ID } from '@/auth/auth.util';
import { Player } from '@/features/player/schema/player.domain.object';

export interface OwnableObject {
  owner: Player;
}

export type ItemRef<T> = {
  item: T;
  serviceType: any;
};

export interface Ownable<
  TargetType extends OwnableObject,
  ParentType extends OwnableObject,
> {
  get(id: ID): Promise<TargetType>;
  getParent(item: TargetType): Promise<ItemRef<ParentType>>;
  getOwner(item: TargetType): Promise<number>;
  getAllOwners(item: TargetType): Promise<(number | symbol)[]>;
}
