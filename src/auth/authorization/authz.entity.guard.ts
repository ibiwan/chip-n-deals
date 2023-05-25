import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  applyDecorators,
  forwardRef,
} from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FeatureDispatchService } from '@/auth/ownership/feature.dispatch.service';
import {
  ID,
  OWNERSHIP_GETTER,
  extractRequestFromContext,
} from '@/auth/auth.util';
import { Ownable } from '@/auth/ownership/ownable.interface';
import { logger } from '@/util/logger';

class CreateForParent {
  getParentId?: (data: any) => ID;
  parentService?: { new (...a: any): Ownable<any, any> };
}

class UpdateTarget {
  getTargetId?: (data: any) => ID;
  targetService?: { new (...a: any): Ownable<any, any> };
}

type OwnershipSpecification = CreateForParent | UpdateTarget;

export const Owned = (self: OwnershipSpecification) => {
  return applyDecorators(SetMetadata(OWNERSHIP_GETTER, self));
};

@Injectable()
export class Ownership implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(/* istanbul ignore next */ () => FeatureDispatchService))
    private featureDispatchService: FeatureDispatchService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    return next.handle();

    const request = extractRequestFromContext(context);

    const user = (request as any).user;
    const handler = context.getHandler();

    try {
      const ownershipGetter: OwnershipSpecification = this.reflector.get(
        OWNERSHIP_GETTER,
        handler,
      );

      const data = context.getArgByIndex(1);
      const getId =
        (ownershipGetter as CreateForParent)?.getParentId ??
        (ownershipGetter as UpdateTarget)?.getTargetId;
      const id: ID = getId ? getId(data) : null;
      const serviceType =
        (ownershipGetter as CreateForParent)?.parentService ??
        (ownershipGetter as UpdateTarget)?.targetService;

      if (id && serviceType) {
        const ownedLeaf =
          await this.featureDispatchService.dispatchFeatureService(
            serviceType,
            'get',
            [id],
          );
      }
    } catch (e) {
      logger.error('Problem establishing ownership');
      logger.debug(e);
      // do not rethrow; continue without error while developing
    }

    return next.handle();
  }
}
