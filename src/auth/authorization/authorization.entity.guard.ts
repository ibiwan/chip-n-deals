import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import {
  UnauthorizedException,
  ExecutionContext,
  NestInterceptor,
  CallHandler,
  Injectable,
} from '@nestjs/common';

import { FeatureDispatchService } from '@/auth/ownership/feature.dispatch.service';
import { reqFromCtx, OWNERSHIP_GETTER, ID } from '@/util/auth.util';

import {
  OwnershipSpecification,
  CreateForParent,
  UpdateTarget,
  Unowned,
} from './owned.decorator';

@Injectable()
export class AuthorizationEntityGuard implements NestInterceptor {
  constructor(
    // @Inject(forwardRef(() => FeatureDispatchService))
    // private featureDispatchService: FeatureDispatchService,

    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = reqFromCtx(context);

    const user = (request as any).user;
    const handler = context.getHandler();

    try {
      const ownershipGetter: OwnershipSpecification = this.reflector.get(
        OWNERSHIP_GETTER,
        handler,
      );

      const getId =
        (ownershipGetter as CreateForParent)?.getParentId ??
        (ownershipGetter as UpdateTarget)?.getTargetId;

      const data = context.getArgByIndex(1);
      const id: ID = getId ? getId(data) : null;

      const serviceType =
        (ownershipGetter as CreateForParent)?.parentService ??
        (ownershipGetter as UpdateTarget)?.targetService ??
        null;

      if (id !== null && id !== undefined && serviceType !== null) {
        const ownedLeaf = null;
        //   await this.featureDispatchService.dispatchFeatureService(
        //     serviceType,
        //     'get',
        //     [id],
        //   );

        const owners = [Unowned];
        // await this.featureDispatchService.dispatchFeatureService(
        //   serviceType,
        //   'getAllOwners',
        //   [ownedLeaf],
        // );

        if (!owners.includes(Unowned) && !owners.includes(user.id)) {
          throw new UnauthorizedException();
        }
      }

      return next.handle();
    } catch (e) {
      console.log(e);
      if (e instanceof UnauthorizedException) {
        throw e;
      } else {
        throw new UnauthorizedException();
      }
    }
  }
}
