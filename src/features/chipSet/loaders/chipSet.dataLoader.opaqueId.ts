import { NestDataLoader } from 'nestjs-dataloader';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { ChipSetEntity, ChipSetRepository } from '../schema';

import {
  ChipSetOpaqueDataLoader,
  ChipSetOpaqueIdType,
} from './chipSet.loader.types';

@Injectable()
export class ChipSetByOpaqueIdLoader
  implements NestDataLoader<ChipSetOpaqueIdType, ChipSetEntity>
{
  constructor(
    @Inject(forwardRef(() => ChipSetRepository))
    private chipSetRepository: ChipSetRepository,
  ) {}

  generateDataLoader(): ChipSetOpaqueDataLoader {
    return new DataLoader<ChipSetOpaqueIdType, ChipSetEntity>(async (keys) => {
      const chipSetEntities = await this.chipSetRepository.getManyByOpaqueIds(
        keys,
      );

      const sortedChipSetEntities = keys.map((key) =>
        chipSetEntities.find((set) => set.opaqueId == key),
      );

      return sortedChipSetEntities;
    });
  }
}
