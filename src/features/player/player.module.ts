import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { PlayerByIdFactory } from './loaders/player.dataLoader.id';
import { PlayerByOpaqueIdFactory } from './loaders/player.dataLoader.opaqueId';
import { PlayerEntity } from './schema/player.db.entity';
import { PlayerMapper } from './schema/player.mapper';
import { PlayerRepository } from './schema/player.repository';
import { PlayerService } from './player.service';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => ConfigModule),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([PlayerEntity]),
  ],

  providers: [
    PlayerByOpaqueIdFactory,
    PlayerRepository,
    PlayerByIdFactory,
    PlayerService,
    PlayerMapper,
  ],
  exports: [PlayerService, PlayerMapper, PlayerRepository],
})
export class PlayerModule {}
