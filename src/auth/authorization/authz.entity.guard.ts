import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  UnauthorizedException,
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
import { shortStack } from '@/util/logger.class';
import { isNumber } from 'lodash';

export const Unowned = Symbol('Unowned');

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
export class EntityGuard implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(/* istanbul ignore next */ () => FeatureDispatchService))
    private featureDispatchService: FeatureDispatchService,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    this.logger.debug('intercept');

    const request = extractRequestFromContext(context);

    this.logger.debug(`request method = ${request.method}`);

    const user = (request as any).user;
    const handler = context.getHandler();

    this.logger.debug(
      `intercept: user = ${user?.id}: ${user?.username}, handler = ${handler?.name}`,
      shortStack(),
    );

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

      if (id !== null && serviceType !== null) {
        const ownedLeaf =
          await this.featureDispatchService.dispatchFeatureService(
            serviceType,
            'get',
            [id],
          );

        const owners = await this.featureDispatchService.dispatchFeatureService(
          serviceType,
          'getAllOwners',
          [ownedLeaf],
        );

        try {
          this.logger.verbose(
            `item ${serviceType.name} with id ${id} has owners ${owners.map(
              (a) => a.toString(),
            )}`,
          );
          this.logger.verbose(
            `ownership: callerId = ${user.id}, owners = [${owners
              .filter((a) => a !== null && a !== undefined)
              .map((id) => (Number.isInteger(id) ? id : id.toString()))
              .join(',')}]`,
          );
        } catch (e) {}

        if (!owners.includes(Unowned) && !owners.includes(user.id)) {
          this.logger.error(`unauthorized access: user does not own target`);
          throw new UnauthorizedException();
        }
      }

      return next.handle();
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      } else {
        console.log(e);
        this.logger.error('ownership decision error', e);
        throw new UnauthorizedException();
      }
    }
  }
}
