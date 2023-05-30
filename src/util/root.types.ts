import { Player } from '@/features/player/schema/player.domain.object';
import { ID } from '@/auth/auth.util';
import { UUID } from 'crypto';

export interface OwnableObject<_T extends DomainObject> {
  owner: Player;
}

export interface CoreObject {}

export type DomainObject = CoreObject;

export interface DomainObjectMapper<T extends DomainObject> {
  gqlFromDomain(_obj: T, ...more: any): Promise<GqlModel<T>>;
  gqlFromDomainMany(_obj: T[], ...more: any): Promise<GqlModel<T>[]>;

  dbFromDomain(_obj: T, ...more: any): Promise<DBEntity<T>>;
  dbFromDomainMany(_obj: T[], ...more: any): Promise<DBEntity<T>[]>;

  gqlFromDb(ent: DBEntity<T>, ...more: any): Promise<GqlModel<T>>;
  gqlFromDbMany(ent: DBEntity<T>[], ...more: any): Promise<GqlModel<T>[]>;

  domainFromDb(ent: DBEntity<T>, ...more: any): Promise<T>;
  domainFromDbMany(ents: DBEntity<T>[], ...more: any): Promise<T[]>;

  dbFromGql(mod: GqlModel<T>, ...more: any): Promise<DBEntity<T>>;
  dbFromGqlMany(mod: GqlModel<T>[], ...more: any): Promise<DBEntity<T>[]>;

  dbFromDto(dto: DtoObject<T>, ...more: any): Promise<DBEntity<T>>;
}

export interface DtoObject<_T extends DomainObject> {}
export interface DBEntity<_T extends DomainObject> {}
export interface GqlModel<_T extends DomainObject> {}
export interface FeatureRepository<T extends DomainObject> {
  getAll(): Promise<DBEntity<T>[]>;
  getOneById(id: number): Promise<DBEntity<T>>;
  getOneByOpaqueId(opaqueId: UUID): Promise<DBEntity<T>>;
  getManyByIds(ids: readonly number[]): Promise<DBEntity<T>[]>;
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

export interface FeatureService<T extends DomainObject> {
  gqlFromDb(...a: any): Promise<DBEntity<T>>;
}
