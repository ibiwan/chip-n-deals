import { DataLoaderInterceptor } from 'nestjs-dataloader';

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AllExceptionsFilter } from '@/util/exception.handler';
import { GraphqlApiModule } from '@/api/graphql.api.module';
import { FeatureModule } from '@/features/features.module';
import { TestLogger } from '@/util/logger.class';
import { AuthModule } from '@/auth/auth.module';

import { TestDatasourceModule } from './test.datasource.module';

export const getTestRootModule = async (): Promise<TestingModule> => {
  const testModuleBuilder = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot(),
      TestDatasourceModule,
      GraphqlApiModule,
      FeatureModule,
      AuthModule,
    ],
    providers: [
      TestLogger,
      {
        provide: APP_INTERCEPTOR,
        useClass: DataLoaderInterceptor,
      },
      // {
      //   provide: APP_FILTER,
      //   useClass: AllExceptionsFilter,
      // },
    ],
  });

  return testModuleBuilder.compile();
};
