import * as DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';

import { Chip, ChipEntity, ChipRepository } from '../schema';
import { ChipDataLoader, ChipIdType } from './chip.loader.types';

@Injectable()
export class ChipsByChipSetIdLoader
  implements NestDataLoader<ChipIdType, Chip>
{
  constructor(private chipRepository: ChipRepository) {}

  generateDataLoader(): ChipDataLoader {
    return new DataLoader<ChipIdType, ChipEntity>(async (keys) => {
      const chipEntities = await this.chipRepository.getManyByIds(keys);

      const sortedChips = chipEntities.reduce(
        (acc: object, cur: ChipEntity) => {
          if (!(cur.chipSetId in acc)) {
            acc[cur.chipSetId] = [];
          }
          acc[cur.chipSetId].push(cur);
          return acc;
        },
        {},
      );

      return keys.map((key) => sortedChips[key]);
    });
  }
}
