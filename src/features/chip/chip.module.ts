import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';

import { ChipResolver } from './chip.resolver';
import { ChipEntityModel } from './chip.entityModel';
import { ChipService } from './chip.service';

@Module({
  imports: [
    // forwardRef accommodates circular references
    forwardRef(/* istanbul ignore next */ () => ChipSetModule),
    TypeOrmModule.forFeature([ChipEntityModel, ChipSetEntityModel]),
  ],
  providers: [ChipResolver, ChipService],
  exports: [ChipService],
})
export class ChipModule {}
