import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { ChipModule, ChipEntity } from '@/features/chip';
import { ChipSetModule, ChipSetEntity } from '@/features/chipSet';
import { PlayerModule, PlayerEntity } from '@/features/player';
import { TableModule } from '@/features/table/table.module';

export const baseDbConfig: TypeOrmModuleOptions = {
  type: 'better-sqlite3',
  entities: [ChipEntity, ChipSetEntity, PlayerEntity],
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
  imports: [
    forwardRef(() => ChipModule),
    forwardRef(() => ChipSetModule),
    forwardRef(() => PlayerModule),
    forwardRef(() => TableModule),
    TypeOrmModule.forRoot(devDbConfig),
  ],
  exports: [],
})
export class SqliteDsModule {}
