import { ChipEntityModel } from '@/features/chip/chip.entityModel';
import { ChipModule } from '@/features/chip/chip.module';
import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: 'db.sqlite',
      entities: [ChipEntityModel, ChipSetEntityModel],
      synchronize: true, // DEV ONLY,
    }),
    ChipModule,
    ChipSetModule,
  ],
  exports: [],
})
export class DatasourceModule {}
