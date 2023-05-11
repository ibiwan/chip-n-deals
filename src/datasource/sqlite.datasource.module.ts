import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ChipEntityModel } from '@/features/chip/chip.entityModel';
import { ChipModule } from '@/features/chip/chip.module';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';

export const baseDbConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  entities: [ChipEntityModel, ChipSetEntityModel],
};

export const devDbConfig = {
  ...baseDbConfig,
  database: 'db.sqlite',
  synchronize: true,
};
export const testDbConfig = {
  ...baseDbConfig,
  database: ':memory:',
  synchronize: true,
};
export const prodDbConfig = {
  ...baseDbConfig,
  database: 'prod.db.sqlite',
  synchronize: false,
};

@Module({
  imports: [TypeOrmModule.forRoot(devDbConfig), ChipModule, ChipSetModule],
  exports: [],
})
export class DatasourceModule {}
