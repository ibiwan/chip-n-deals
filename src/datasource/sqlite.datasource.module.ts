import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { FeatureModule } from '@/features/features.module';
import { ChipEntity } from '@/features/chip/schema/chip.db.entity';
import { ChipSetEntity } from '@/features/chipSet/schema/chipSet.db.entity';
import { PlayerEntity } from '@/features/player/schema/player.db.entity';

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
    TypeOrmModule.forRoot(devDbConfig),
    forwardRef(() => FeatureModule),
  ],
  exports: [],
})
export class SqliteDatasourceModule {}
