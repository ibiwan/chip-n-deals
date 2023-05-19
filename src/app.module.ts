import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from '@/auth/auth.module';
import { Ownership } from '@/auth/auth.guard';
import { ChipsGraphqlModule } from '@/api/graphql.module';
import { DatasourceModule } from '@/datasource/sqlite.datasource.module';

import { ChipModule } from '@/features/chip/chip.module';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';
import { PlayerModule } from '@/features/player/player.module';

const featureModules = [ChipModule, ChipSetModule, PlayerModule];

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ChipsGraphqlModule,
    DatasourceModule,
    ...featureModules,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: Ownership,
    },
  ],
})
export class AppModule {}
