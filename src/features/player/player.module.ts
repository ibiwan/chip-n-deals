import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthorizationModule } from '@/auth/authorization/authz.module';
import { AuthenticationModule } from '@/auth/authentication/authn.module';

import { PlayerService } from './player.service';
import { PlayerEntityModel } from './player.entityModel';

@Module({
  imports: [
    // forwardRef accommodates circular references
    forwardRef(/* istanbul ignore next */ () => AuthenticationModule),
    forwardRef(/* istanbul ignore next */ () => AuthorizationModule),
    TypeOrmModule.forFeature([PlayerEntityModel]),
    ConfigModule,
  ],

  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
