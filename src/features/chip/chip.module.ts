import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipResolver } from './chip.resolver';
import { ChipEntityModel } from './chip.entityModel';
import { ChipService } from './chip.service';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';

@Module({
  imports: [
    forwardRef(() => ChipSetModule),
    TypeOrmModule.forFeature([
      ChipEntityModel,
      ChipSetEntityModel,
    ])
  ],
  providers: [
    ChipResolver,
    ChipService,
  ],
  exports: [ChipService],
})
export class ChipModule { }
