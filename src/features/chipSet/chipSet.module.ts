import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipModule } from '@/features/chip/chip.module';
import { ChipEntityModel } from '@/features/chip/chip.entityModel';

import { ChipSetEntityModel } from './chipSet.entityModel';
import { ChipSetResolver } from './chipSet.resolver';
import { ChipSetService } from './chipSet.service';

@Module({
  imports: [
    forwardRef(() => ChipModule),
    TypeOrmModule.forFeature([ChipEntityModel, ChipSetEntityModel]),
  ],
  providers: [ChipSetResolver, ChipSetService],
  exports: [ChipSetService],
})
export class ChipSetModule {}
