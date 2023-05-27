import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipSetModule } from '@/features/chipSet/chipSet.module';
import { OwnershipModule } from '@/auth/ownership/ownership.module';

import { ChipResolver } from './chip.resolver';

import { ChipService } from './chip.service';
import { ChipsByChipIdLoader, ChipsByChipSetIdLoader } from './chip.dataLoader';
import { ChipEntity } from './schema/chip.db.entity';
import { ChipSetEntity } from '../chipSet/schema/chipSet.db.entity';

@Module({
  imports: [
    // forwardRef accommodates circular references
    forwardRef(() => ChipSetModule),
    forwardRef(() => OwnershipModule),
    TypeOrmModule.forFeature([ChipEntity, ChipSetEntity]),
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
