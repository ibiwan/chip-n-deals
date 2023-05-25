import { DataLoaderInterceptor } from 'nestjs-dataloader';

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { GraphqlApiModule } from '@/api/graphql.api.module';
import { AuthModule } from '@/auth/auth.module';
import { FeatureModule } from '@/features/features.module';

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
      {
        provide: APP_INTERCEPTOR,
        useClass: DataLoaderInterceptor,
      },
    ],
  });

  return testModuleBuilder.compile();
};
