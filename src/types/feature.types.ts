export function from(type: () => CoreObject) {
  return function (source: CoreObject, fields: Record<string, any> = {}): any {
    const dest = Object.create(type());
    Object.assign(dest, source, fields);

    return dest;
  };
}

export class CoreObject {}
export type DomainObject = CoreObject;

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface DtoObject<_T extends DomainObject> {}
export interface DBEntity<_T extends DomainObject> {}
export interface GqlModel<_T extends DomainObject> {}
export interface Meta<_T extends DomainObject> {}
/* eslint-enable @typescript-eslint/no-empty-interface */
