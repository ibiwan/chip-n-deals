import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OwnershipModule } from '@/auth/ownership/ownership.module';

import { ChipSetModule, ChipSetEntity } from '@/features/chipSet';
import { PlayerModule } from '@/features/player';

import {
  ChipsByChipSetOpaqueIdLoader,
  ChipsByChipSetIdLoader,
  ChipsByChipIdLoader,
} from './loaders';

import { ChipRepository, ChipEntity, ChipMapper } from './schema';

import { ChipResolver } from './chip.resolver';
import { ChipService } from './chip.service';

@Module({
  imports: [
    // forwardRef accommodates circular references
    forwardRef(() => ChipSetModule),
    forwardRef(() => OwnershipModule),
    forwardRef(() => PlayerModule),
    forwardRef(() => TypeOrmModule.forFeature([ChipEntity, ChipSetEntity])),
  ],
  providers: [
    ChipsByChipSetOpaqueIdLoader,
    ChipsByChipSetIdLoader,
    ChipsByChipIdLoader,
    ChipRepository,
    ChipResolver,
    ChipService,
    ChipMapper,
  ],
  exports: [ChipService, ChipMapper],
})
export class ChipModule {}
