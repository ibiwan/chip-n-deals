import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthenticationModule } from '@/auth/authentication/authn.module';
import { AuthorizationModule } from '@/auth/authorization/authz.module';

import { PlayerByOpaqueIdLoader } from './loaders/player.dataLoader.opaqueId';
import { PlayerRepository, PlayerEntity, PlayerMapper } from './schema';
import { PlayerService } from './player.service';
import { PlayerByIdLoader } from './loaders';

@Module({
  imports: [
    forwardRef(() => AuthenticationModule),
    forwardRef(() => AuthorizationModule),
    forwardRef(() => ConfigModule),
    forwardRef(() => TypeOrmModule.forFeature([PlayerEntity])),
  ],

  providers: [
    PlayerByOpaqueIdLoader,
    PlayerRepository,
    PlayerByIdLoader,
    PlayerService,
    PlayerMapper,
  ],
  exports: [PlayerService, PlayerMapper, PlayerRepository],
})
export class PlayerModule {}
