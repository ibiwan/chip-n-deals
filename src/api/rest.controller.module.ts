import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipModule } from '@/features/chip/chip.module';
import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { ChipSetController } from '@/features/chipSet/chipSet.rest.controller';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';
import { ChipEntityModel } from '@/features/chip/chip.entityModel';

@Module({
  imports: [
    ChipModule,
    ChipSetModule,
    TypeOrmModule.forFeature([ChipEntityModel, ChipSetEntityModel]),
  ],
  controllers: [ChipSetController],
})
export class ControllerModule {}
