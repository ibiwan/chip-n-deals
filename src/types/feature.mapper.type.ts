import { DBEntity, DomainObject, DtoObject, GqlModel } from './feature.types';

export interface DomainObjectMapper<T extends DomainObject> {
  dbFromDomain(_obj: T, ..._more: any): Promise<DBEntity<T>>;
  dbFromDomainMany(_obj: T[], ..._more: any): Promise<DBEntity<T>[]>;

  dbFromDto(_dto: DtoObject<T>, ..._more: any): Promise<DBEntity<T>>;
  dbFromDtoMany(_dto: DtoObject<T>[], ..._more: any): Promise<DBEntity<T>[]>;

  dbFromGql(_mod: GqlModel<T>, ..._more: any): Promise<DBEntity<T>>;
  dbFromGqlMany(_mod: GqlModel<T>[], ..._more: any): Promise<DBEntity<T>[]>;

  domainFromDb(_ent: DBEntity<T>, ..._more: any): Promise<T>;
  domainFromDbMany(_ents: DBEntity<T>[], ..._more: any): Promise<T[]>;

  gqlFromDb(_ent: DBEntity<T>, ..._more: any): Promise<GqlModel<T>>;
  gqlFromDbMany(_ent: DBEntity<T>[], ..._more: any): Promise<GqlModel<T>[]>;

  gqlFromDomain(_obj: T, ..._more: any): Promise<GqlModel<T>>;
  gqlFromDomainMany(_obj: T[], ..._more: any): Promise<GqlModel<T>[]>;
}
