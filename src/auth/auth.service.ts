import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Timer } from '@/util/timer.class';

import { PlayerService } from '../features/player/player.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(/* istanbul ignore next */ () => PlayerService))
    private playerService: PlayerService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async onApplicationBootstrap() {
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
    await this.playerService.createAdmin(adminUsername, adminHash);
  }

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.playerService.playerByUsername(username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passValid = this.validatePassword(user.passhash, pass);
    if (!passValid) {
      throw new UnauthorizedException();
    }

    const payload = { username: user.username, sub: user.opaqueId };
    const token = await this.jwtService.signAsync(payload);
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
    console.log(`hashing password, ${rounds} rounds, ${msec} ms`);
    return hash;
  }

  validatePassword(hash: string, password: string): boolean {
    const timer = Timer.start();
    const isMatch = bcrypt.compareSync(password, hash);
    const elapsed = timer.finish();
    console.log(`validating password: ${elapsed.ms()} ms`);
    return isMatch;
  }
}
