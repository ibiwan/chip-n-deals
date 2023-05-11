import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipModule } from '@/features/chip/chip.module';
import { ChipEntityModel } from '@/features/chip/chip.entityModel';
import { ChipController } from '@/features/chip/chip.rest.controller';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { ChipSetController } from '@/features/chipSet/chipSet.rest.controller';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';

@Module({
  imports: [
    ChipModule,
    ChipSetModule,
    TypeOrmModule.forFeature([ChipEntityModel, ChipSetEntityModel]),
  ],
  controllers: [ChipSetController, ChipController],
})
export class ControllerModule {}
