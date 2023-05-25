import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { FeatureModule } from '@/features/features.module';

import { ChipEntityModel } from '@/features/chip/chip.entityModel';
import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { PlayerEntityModel } from '@/features/player/player.entityModel';

export const baseDbConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  entities: [ChipEntityModel, ChipSetEntityModel, PlayerEntityModel],
};

export const devDbConfig = {
  ...baseDbConfig,
  database: 'db.sqlite',
  synchronize: true,
  debugger: true,
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
  imports: [TypeOrmModule.forRoot(devDbConfig), FeatureModule],
  exports: [],
})
export class SqliteDatasourceModule {}
