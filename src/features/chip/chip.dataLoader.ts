import * as DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';

import { Injectable } from '@nestjs/common';

import { ChipEntityModel } from './chip.entityModel';
import { ChipService } from './chip.service';

@Injectable()
export class ChipsByChipSetIdLoader
  implements NestDataLoader<number, ChipEntityModel>
{
  constructor(private readonly chipService: ChipService) {}

  generateDataLoader(): DataLoader<number, ChipEntityModel> {
    return new DataLoader<number, ChipEntityModel>(async (keys) => {
      const chips = await this.chipService.chipsForChipSets(keys);

      const sortedChips = chips.reduce((acc: {}, cur: ChipEntityModel) => {
        if (!(cur.chipSetId in acc)) {
          acc[cur.chipSetId] = [];
        }
        acc[cur.chipSetId].push(cur);
        return acc;
      }, {});

      return keys.map((key) => sortedChips[key]);
    });
  }
}

@Injectable()
export class ChipsByChipIdLoader
  implements NestDataLoader<number, ChipEntityModel>
{
  constructor(private readonly chipService: ChipService) {}

  generateDataLoader(): DataLoader<number, ChipEntityModel> {
    return new DataLoader<number, ChipEntityModel>((keys) => {
      return this.chipService.findByIds(keys);
    });
  }
}
