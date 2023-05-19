import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/auth/auth.module';

import { PlayerService } from './player.service';
import { PlayerEntityModel } from './player.entityModel';

@Module({
  imports: [
    // forwardRef accommodates circular references
    forwardRef(/* istanbul ignore next */ () => AuthModule),
    ConfigModule,
    TypeOrmModule.forFeature([PlayerEntityModel]),
  ],

  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
