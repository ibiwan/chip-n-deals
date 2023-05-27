import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthorizationModule } from '@/auth/authorization/authz.module';
import { AuthenticationModule } from '@/auth/authentication/authn.module';

import { PlayerService } from './player.service';
import { PlayerLoader } from './player.dataLoader';
import { PlayerEntity } from './schema/player.db.entity';

@Module({
  imports: [
    // forwardRef accommodates circular references
    forwardRef(/* istanbul ignore next */ () => AuthenticationModule),
    forwardRef(/* istanbul ignore next */ () => AuthorizationModule),
    TypeOrmModule.forFeature([PlayerEntity]),
    ConfigModule,
  ],

  providers: [PlayerService, PlayerLoader],
  exports: [PlayerService],
})
export class PlayerModule {}
