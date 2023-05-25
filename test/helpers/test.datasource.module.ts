import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { testDbConfig } from '@/datasource/sqlite.datasource.module';
import { FeatureModule } from '@/features/features.module';

@Module({
  imports: [TypeOrmModule.forRoot(testDbConfig), FeatureModule],
  exports: [],
})
export class TestDatasourceModule {}
