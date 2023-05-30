import * as DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';

import { ChipRepository, ChipEntity } from '../schema';
import { ChipOpaqueDataLoader, ChipOpaqueIdType } from './chip.loader.types';

@Injectable()
export class ChipsByChipSetOpaqueIdLoader
  implements NestDataLoader<ChipOpaqueIdType, ChipEntity>
{
  constructor(private chipRepository: ChipRepository) {}

  generateDataLoader(): ChipOpaqueDataLoader {
    return new DataLoader<ChipOpaqueIdType, ChipEntity>(async (keys) => {
      const chipEntities =
        await this.chipRepository.getManyForChipSetsByOpaqueIds(keys);

      const sortedChips = chipEntities.reduce(
        (acc: object, cur: ChipEntity) => {
          const chipSetOpaqueId = cur.chipSet.opaqueId;
          if (!(chipSetOpaqueId in acc)) {
            acc[chipSetOpaqueId] = [];
          }
          acc[chipSetOpaqueId].push(cur);
          return acc;
        },
        {},
      );

      return keys.map((key) => sortedChips[key]);
    });
  }
}
