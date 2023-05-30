import { OwnableObjectService } from '@/util/root.types';
import { ID, OWNERSHIP_GETTER } from '../auth.util';
import { SetMetadata, applyDecorators } from '@nestjs/common';
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

console.log('authz', { OwnedMethod });
