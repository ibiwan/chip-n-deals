import {
  CallHandler,
  CanActivate,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
  applyDecorators,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { jwtConstants } from './constants';
import {
  extractRequestFromContext,
  extractTokenFromRequestHeader,
} from './auth.util';
import { Observable } from 'rxjs';

export const IS_PUBLIC_KEY = Symbol();
// export const ID_GETTER = Symbol();
const OWNER_GETTER = Symbol();
const PARENT_GETTER = Symbol();

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Owned = (parentExtractor, ownerExtractor) =>
  applyDecorators(
    SetMetadata(PARENT_GETTER, parentExtractor),
    SetMetadata(OWNER_GETTER, ownerExtractor),
  );

@Injectable()
export class Ownership implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // const idGetter = this.reflector.get(ID_GETTER, context.getHandler());
    const parentGetter = this.reflector.get(
      PARENT_GETTER,
      context.getHandler(),
    );
    const ownerGetter = this.reflector.get(OWNER_GETTER, context.getHandler());
    const data = context.getArgByIndex(1);
    // if (idGetter && data) {
    //   const id = idGetter(data);
    //   console.log({ id });
    // }

    // console.log({ parentGetter, ownerGetter, data });

    return next.handle();
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  /**
   * @method canActivate implements CanActivate, guards routes/resolvers by annotation
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isPublic(context)) {
      // console.log('public');
      return true;
    }

    const request = extractRequestFromContext(context);
    const token = extractTokenFromRequestHeader(request);
    if (!token) {
      // console.log('no token');
      throw new UnauthorizedException();
    }

    request['user'] = await this.verifyToken(token);
    return true;
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async verifyToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      return payload;
    } catch {
      console.log('bad token');
      throw new UnauthorizedException();
    }
  }
}
