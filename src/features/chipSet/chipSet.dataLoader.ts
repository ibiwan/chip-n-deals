import * as DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';

import { Injectable, Logger } from '@nestjs/common';

import { ChipSetService } from './chipSet.service';
import { ChipSetEntity } from './schema/chipSet.db.entity';
import { ChipSet } from './schema/chipSet.domain.object';

export type ChipSetIdType = ChipSetEntity['id'];
export type ChipSetDataLoader = DataLoader<ChipSetIdType, ChipSet>;

@Injectable()
export class ChipSetLoader implements NestDataLoader<ChipSetIdType, ChipSet> {
  constructor(private readonly chipSetService: ChipSetService) {}

  private readonly logger = new Logger(this.constructor.name);

  generateDataLoader(): ChipSetDataLoader {
    return new DataLoader<ChipSetIdType, ChipSet>(async (keys) => {
      this.logger.verbose(`ChipSet: keys = ${keys.join(', ')}`);

      const chipSets = await this.chipSetService.chipSetsByIds(keys);

      const sortedChipSets = keys.map((key) =>
        chipSets.find((set) => set.id == key),
      );

      return sortedChipSets;
    });
  }
}

export type ChipSetOpaqueIdType = ChipSetEntity['opaqueId'];
export type ChipSetOpaqueDataLoader = DataLoader<ChipSetOpaqueIdType, ChipSet>;

@Injectable()
export class ChipSetByOpaqueIdLoader
  implements NestDataLoader<ChipSetOpaqueIdType, ChipSet>
{
  constructor(private readonly chipSetService: ChipSetService) {}

  private readonly logger = new Logger(this.constructor.name);

  generateDataLoader(): ChipSetOpaqueDataLoader {
    return new DataLoader<ChipSetOpaqueIdType, ChipSet>(async (keys) => {
      this.logger.verbose(`ChipSet: keys = ${keys.join(', ')}`);

      const chipSets = await this.chipSetService.chipSetsByOpaqueIds(keys);

      const sortedChipSets = keys.map((key) =>
        chipSets.find((set) => set.opaqueId == key),
      );

      return sortedChipSets;
    });
  }
}
