import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Timer } from '@/util/timer.class';

import { PlayerService } from '@/features/player/player.service';
import { PlayerRepository } from '@/features/player';

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(forwardRef(() => PlayerService))
    private playerService: PlayerService,
    @Inject(forwardRef(() => PlayerRepository))
    private playerRepository: PlayerRepository,
    @Inject(forwardRef(() => JwtService))
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get('JWT_SECRET');
  }

  private readonly logger = new Logger(this.constructor.name);

  private jwtSecret: string;

  async onApplicationBootstrap() {
    this.logger.debug('bootstrap');
    await this.createAdminUserIfNeeded();
  }

  async createAdminUserIfNeeded() {
    const adminUsername = this.configService.get('ADMIN_NAME');
    if (!adminUsername) {
      return;
    }

    const adminUser = await this.playerService.playerByUsername(adminUsername);
    if (adminUser) {
      return;
    }

    const adminHash = this.configService.get('ADMIN_HASH');
    console.log({ adminUsername, adminHash });
    await this.playerService.createAdmin(adminUsername, adminHash);
  }

  async signIn(username: string, pass: string): Promise<any> {
    this.logger.debug(`signIn: username = ${username}`);

    const userEntity = await this.playerRepository.getOneByUsername(username);

    if (!userEntity) {
      this.logger.error(`authentication: no user with username = ${username}`);
      throw new UnauthorizedException();
    }

    const passValid = this.validatePassword(userEntity.passhash, pass);
    if (!passValid) {
      this.logger.error(
        `authentication: incorrect password for user ${username}`,
      );
      throw new UnauthorizedException();
    }

    const payload = { username: userEntity.username, sub: userEntity.opaqueId };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.jwtSecret,
    });
    const { exp: expiry } = jwt.decode(token, { json: true });

    return {
      access_token: token,
      expiry,
    };
  }

  hashPassword(password: string): string {
    const rounds = 14;
    const timer = Timer.start();
    const hash = bcrypt.hashSync(password, rounds);
    const msec = timer.finish().ms();
    this.logger.log(`hashing password: ${rounds} rounds, ${msec}ms`);

    return hash;
  }

  validatePassword(hash: string, password: string): boolean {
    const timer = Timer.start();
    const isMatch = bcrypt.compareSync(password, hash);
    const msec = timer.finish().ms;
    this.logger.log(`validating password, ${msec}ms`);

    return isMatch;
  }
}
