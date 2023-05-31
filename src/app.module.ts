import { DataLoaderInterceptor } from 'nestjs-dataloader';

import { ConfigModule } from '@nestjs/config';
import { Module, forwardRef } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { SqliteDsModule } from '@/datasource/sqlite.datasource.module';
import { GraphqlApiModule } from '@/api/graphql.api.module';
import { ChipModule } from './features/chip';
import { ChipSetModule } from './features/chipSet';
import { PlayerModule } from './features/player';
import { TableModule } from './features/table/table.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => SqliteDsModule),
    forwardRef(() => GraphqlApiModule),
    forwardRef(() => ChipSetModule),
    forwardRef(() => PlayerModule),
    forwardRef(() => TableModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ChipModule),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
  ],
})
export class AppModule {}
