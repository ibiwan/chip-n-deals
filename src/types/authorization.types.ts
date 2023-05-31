import { Player } from '@/features/player';
import { ID } from '@/util/auth.util';

import { DomainObject } from './feature.types';

export interface OwnableObject<_T extends DomainObject> {
  owner: Player;
}

export type ItemRef<T> = {
  item: T;
  serviceType: any;
};

export interface OwnableObjectService<
  T extends OwnableObject<DomainObject>,
  ParentType extends OwnableObject<DomainObject>,
> {
  get(id: ID): Promise<T>;
  getParent(item: T): Promise<ItemRef<ParentType>>;
  getOwner(item: T): Promise<number>;
  getAllOwners(item: T): Promise<(number | symbol)[]>;
}
