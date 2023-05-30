import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { ChipSetRepository, ChipSetEntity } from '../schema';
import { ChipSetDataLoader, ChipSetIdType } from './chipSet.loader.types';

@Injectable()
export class ChipSetByIdLoader
  implements NestDataLoader<ChipSetIdType, ChipSetEntity>
{
  constructor(private chipSetRepository: ChipSetRepository) {}

  generateDataLoader(): ChipSetDataLoader {
    return new DataLoader<ChipSetIdType, ChipSetEntity>(async (keys) => {
      const chipSetEntities = await this.chipSetRepository.getManyByIds(keys);

      const sortedChipSetEntities = keys.map((key) =>
        chipSetEntities.find((set) => set.id == key),
      );

      return sortedChipSetEntities;
    });
  }
}
