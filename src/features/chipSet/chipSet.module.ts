import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OwnershipModule } from '@/auth/ownership/ownership.module';
import { PlayerModule } from '@/features/player';

import { ChipEntity, ChipModule } from '@/features/chip';

import { ChipSetByIdLoader, ChipSetByOpaqueIdLoader } from './loaders';
import { ChipSetEntity, ChipSetMapper, ChipSetRepository } from './schema';
import { ChipSetResolver } from './chipSet.resolver';
import { ChipSetService } from './chipSet.service';

@Module({
  imports: [
    forwardRef(() => ChipModule),
    forwardRef(() => OwnershipModule),
    forwardRef(() => PlayerModule),
    TypeOrmModule.forFeature([ChipEntity, ChipSetEntity]),
  ],
  providers: [
    ChipSetByOpaqueIdLoader,
    ChipSetRepository,
    ChipSetByIdLoader,
    ChipSetResolver,
    ChipSetService,
    ChipSetMapper,
  ],
  exports: [ChipSetService, ChipSetMapper, ChipSetRepository],
})
export class ChipSetModule {}
