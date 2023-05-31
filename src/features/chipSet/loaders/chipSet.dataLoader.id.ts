import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { ChipSetRepository } from '../services';
import { ChipSetEntity } from '../schema';
import { Id } from '@/types/misc.types';

export type ChipSetByIdLoader = DataLoader<Id, ChipSetEntity>;

@Injectable()
export class ChipSetByIdFactory implements NestDataLoader<Id, ChipSetEntity> {
  constructor(private chipSetRepository: ChipSetRepository) {}

  generateDataLoader(): ChipSetByIdLoader {
    return new DataLoader<Id, ChipSetEntity>(async (keys) =>
      this.chipSetRepository.getManyByIds(keys),
    );
  }
}
