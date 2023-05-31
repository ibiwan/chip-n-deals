import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { ChipRepository } from '../services/chip.repository';
import { ChipEntity } from '../schema';
import { Id } from '@/types/misc.types';

export type ChipsByChipSetIdLoader = DataLoader<Id, ChipEntity>;

@Injectable()
export class ChipsByChipSetIdFactory implements NestDataLoader<Id, ChipEntity> {
  constructor(private chipRepository: ChipRepository) {}

  generateDataLoader(): ChipsByChipSetIdLoader {
    return new DataLoader<Id, ChipEntity>(async (keys) =>
      this.chipRepository.getManyByIds(keys),
    );
  }
}
