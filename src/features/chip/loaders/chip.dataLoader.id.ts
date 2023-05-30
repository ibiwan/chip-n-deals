import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { ChipEntity, ChipRepository } from '../schema';
import { ChipDataLoader, ChipIdType } from './chip.loader.types';

@Injectable()
export class ChipsByChipIdLoader
  implements NestDataLoader<ChipIdType, ChipEntity>
{
  constructor(private chipRepository: ChipRepository) {}

  generateDataLoader(): ChipDataLoader {
    return new DataLoader<ChipIdType, ChipEntity>(async (keys) => {
      const results = await this.chipRepository.getManyByIds(keys);

      return results.filter(
        (result: ChipEntity | Error) => result instanceof ChipEntity,
      ) as ChipEntity[];
    });
  }
}
