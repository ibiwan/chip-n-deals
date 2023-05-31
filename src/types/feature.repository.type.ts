import { UUID } from 'crypto';

import { DBEntity, DomainObject } from './feature.types';

export interface FeatureRepository<T extends DomainObject> {
  getAll(): Promise<DBEntity<T>[]>;
  oneById(id: number): Promise<DBEntity<T>>;
  oneByOid(opaqueId: UUID): Promise<DBEntity<T>>;
  getManyByIds(ids: readonly number[]): Promise<DBEntity<T>[]>;
}
