import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChipModule } from '@/features/chip/chip.module';
import { OwnershipModule } from '@/auth/ownership/ownership.module';

import { ChipSetResolver } from './chipSet.resolver';
import { ChipSetService } from './chipSet.service';
import { ChipSetLoader } from './chipSet.dataLoader';
import { ChipEntity } from '../chip/schema/chip.db.entity';
import { ChipSetEntity } from './schema/chipSet.db.entity';

@Module({
  imports: [
    forwardRef(/* istanbul ignore next */ () => ChipModule),
    forwardRef(/* istanbul ignore next */ () => OwnershipModule),

    TypeOrmModule.forFeature([ChipEntity, ChipSetEntity]),
  ],
  providers: [ChipSetResolver, ChipSetService, ChipSetLoader],
  exports: [ChipSetService],
})
export class ChipSetModule {}
