export interface DomainObject {}

export abstract class GqlModel<DomainType = DomainObject> {
  static fromDomainObject<DomainType>(obj: DomainType): GqlModel<DomainType> {
    throw Error;
  }
  toDomainObject(): DomainType {
    throw Error;
  }
}

export abstract class DBEntity<DomainType = DomainObject> {
  static fromDomainObject<DomainType>(obj: DomainType): DBEntity<DomainType> {
    throw Error;
  }
  toDomainObject(): DomainType {
    throw Error;
  }
}

export interface EntityModel<DomainType = DomainObject>
  extends GqlModel<DomainType>,
    DBEntity<DomainType> {}
