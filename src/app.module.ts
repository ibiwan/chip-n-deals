import { DataLoaderInterceptor } from 'nestjs-dataloader';

import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { SqliteDatasourceModule } from '@/datasource/sqlite.datasource.module';
import { GraphqlApiModule } from '@/api/graphql.api.module';
import { FeatureModule } from '@/features/features.module';
import { AuthModule } from '@/auth/auth.module';
import { AllExceptionsFilter } from './util/exception.handler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    SqliteDatasourceModule,
    GraphqlApiModule,
    FeatureModule,
    AuthModule,
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
