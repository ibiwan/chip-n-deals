import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { ChipSetModule } from '@/features/chipSet/chipSet.module';
import { OwnershipModule } from '@/auth/ownership/ownership.module';

import { ChipResolver } from './chip.resolver';
import { ChipEntityModel } from './chip.entityModel';
import { ChipService } from './chip.service';
import { ChipsByChipIdLoader, ChipsByChipSetIdLoader } from './chip.dataLoader';

@Module({
  imports: [
    // forwardRef accommodates circular references
    forwardRef(/* istanbul ignore next */ () => ChipSetModule),
    forwardRef(/* istanbul ignore next */ () => OwnershipModule),
    TypeOrmModule.forFeature([ChipEntityModel, ChipSetEntityModel]),
  ],
  providers: [
    ChipResolver,
    ChipService,
    ChipsByChipIdLoader,
    ChipsByChipSetIdLoader,
  ],
  exports: [ChipService],
})
export class ChipModule {}
