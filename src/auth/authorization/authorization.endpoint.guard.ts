import { UUID } from 'crypto';

import {
  UnauthorizedException,
  ExecutionContext,
  CanActivate,
  Injectable,
  Logger,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

import { tokenFromReq, reqFromCtx, IS_PUBLIC_KEY } from '@/util/auth.util';
import { PlayerRepository } from '@/features/player';

@Injectable()
export class AuthorizationEndpointGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,
    @Inject(forwardRef(() => PlayerRepository))
    private playerRepository: PlayerRepository,

    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get('JWT_SECRET');
  }

  private readonly logger = new Logger(this.constructor.name);

  private jwtSecret: string;

  /**
   * @method canActivate implements CanActivate, guards routes/resolvers by annotation
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.verbose(`canActivate`);

    if (this.isPublic(context)) {
      this.logger.debug(`is public: ${context.getHandler().name}`);

      return true;
    }

    const request = reqFromCtx(context);

    const token = tokenFromReq(request);
    if (!token) {
      this.logger.error(`unauthorized access: no token in request`);

      throw new UnauthorizedException();
    }

    const userClaims = (await this.verifyToken(token)) as any;
    const userEntity = await this.playerRepository.oneByOid(
      userClaims.sub as UUID,
    );
    if (!userEntity) {
      this.logger.error(
        `unauthorized access: no user with id = ${userClaims.sub}`,
      );
      throw new UnauthorizedException();
    }
    request['user'] = userEntity;

    return true;
  }

  private isPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async verifyToken(token: string): Promise<object> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      return payload;
    } catch {
      this.logger.error('unauthorized access: invalid token');

      throw new UnauthorizedException();
    }
  }
}
