import { Module } from '@nestjs/common';

import { ChipsGraphqlModule } from './api/graphql.module';
import { DatasourceModule } from './datasource/sqlite.datasource.module';
import { ChipModule } from './features/chip/chip.module';
import { ChipSetModule } from './features/chipSet/chipSet.module';
import { AuthModule } from './auth/auth.module';
import { PlayerModule } from './player/player.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { Ownership } from './auth/auth.guard';

@Module({
  imports: [
    ChipModule,
    ChipSetModule,
    ChipsGraphqlModule,
    DatasourceModule,
    AuthModule,
    PlayerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: Ownership,
    },
  ],
})
export class AppModule {}
