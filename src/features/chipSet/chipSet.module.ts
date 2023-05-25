import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipModule } from '@/features/chip/chip.module';
import { ChipEntityModel } from '@/features/chip/chip.entityModel';
import { OwnershipModule } from '@/auth/ownership/ownership.module';

import { ChipSetEntityModel } from './chipSet.entityModel';
import { ChipSetResolver } from './chipSet.resolver';
import { ChipSetService } from './chipSet.service';
import { ChipSetLoader } from './chipSet.dataLoader';

@Module({
  imports: [
    forwardRef(/* istanbul ignore next */ () => ChipModule),
    forwardRef(/* istanbul ignore next */ () => OwnershipModule),

    TypeOrmModule.forFeature([ChipEntityModel, ChipSetEntityModel]),
  ],
  providers: [ChipSetResolver, ChipSetService, ChipSetLoader],
  exports: [ChipSetService],
})
export class ChipSetModule {}
