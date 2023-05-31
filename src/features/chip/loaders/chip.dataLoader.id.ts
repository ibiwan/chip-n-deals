import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { ChipRepository } from '../services';
import { ChipEntity } from '../schema';
import { Id } from '@/types/misc.types';

export type ChipsByChipIdLoader = DataLoader<Id, ChipEntity>;

@Injectable()
export class ChipsByChipIdFactory
  implements NestDataLoader<number, ChipEntity>
{
  constructor(private chipRepository: ChipRepository) {}

  generateDataLoader(): ChipsByChipIdLoader {
    return new DataLoader<Id, ChipEntity>(async (keys) =>
      this.chipRepository.getManyByIds(keys),
    );
  }
}
