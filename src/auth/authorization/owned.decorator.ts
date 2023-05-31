import { SetMetadata, applyDecorators } from '@nestjs/common';

import { OwnableObjectService } from '@/types';

import { ID, OWNERSHIP_GETTER } from '@/util/auth.util';

export const Unowned = Symbol('Unowned');

export class CreateForParent {
  getParentId?: (data: any) => ID;
  parentService?: { new (...a: any): OwnableObjectService<any, any> };
}

export class UpdateTarget {
  getTargetId?: (data: any) => ID;
  targetService?: { new (...a: any): OwnableObjectService<any, any> };
}

export type OwnershipSpecification = CreateForParent | UpdateTarget;

export const OwnedMethod = (self: OwnershipSpecification) => {
  return applyDecorators(SetMetadata(OWNERSHIP_GETTER, self));
};
