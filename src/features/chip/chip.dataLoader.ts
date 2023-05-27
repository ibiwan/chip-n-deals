import * as DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';

import { Injectable, Logger } from '@nestjs/common';

import { ChipService } from './chip.service';
import { ChipEntity } from './schema/chip.db.entity';
import { Chip } from './schema/chip.domain.object';

export type ChipIdType = ChipEntity['id'];
export type ChipDataLoader = DataLoader<ChipIdType, Chip>;

@Injectable()
export class ChipsByChipSetIdLoader
  implements NestDataLoader<ChipIdType, Chip>
{
  constructor(private readonly chipService: ChipService) {}

  private readonly logger = new Logger(this.constructor.name);

  generateDataLoader(): ChipDataLoader {
    return new DataLoader<ChipIdType, Chip>(async (keys) => {
      this.logger.verbose(`ChipsByChipSetId: keys = ${keys.join(', ')}`);

      const chips = await this.chipService.chipsForChipSets(keys);

      const sortedChips = chips.reduce((acc: {}, cur: Chip) => {
        if (!(cur.chipSet.id in acc)) {
          acc[cur.chipSet.id] = [];
        }
        acc[cur.chipSet.id].push(cur);
        return acc;
      }, {});

      return keys.map((key) => sortedChips[key]);
    });
  }
}

@Injectable()
export class ChipsByChipIdLoader implements NestDataLoader<ChipIdType, Chip> {
  constructor(private readonly chipService: ChipService) {}

  private readonly logger = new Logger(this.constructor.name);

  generateDataLoader(): ChipDataLoader {
    return new DataLoader<ChipIdType, Chip>(async (keys) => {
      this.logger.verbose(`ChipsByChipId: keys = ${keys.join(', ')}`);
      const results = await this.chipService.findByIds(keys);
      const chips = results.filter(
        (result: Chip | Error) => result instanceof Chip,
      );
      return chips;
    });
  }
}
