import { Module } from '@nestjs/common';

import { ChipSetModule } from './chipSet/chipSet.module';
import { PlayerModule } from './player/player.module';
import { TableModule } from './table/table.module';
import { ChipModule } from './chip/chip.module';

@Module({
  imports: [ChipModule, ChipSetModule, PlayerModule, TableModule],
})
export class FeatureModule {}
