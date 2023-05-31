import * as DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';

import { ChipRepository } from '../services';
import { ChipEntity } from '../schema';
import { Oid } from '@/types/misc.types';

export type ChipsByChipSetOpaqueIdLoader = DataLoader<Oid, ChipEntity>;

@Injectable()
export class ChipsByChipSetOpaqueIdFactory
  implements NestDataLoader<Oid, ChipEntity>
{
  constructor(private chipRepository: ChipRepository) {}

  generateDataLoader(): ChipsByChipSetOpaqueIdLoader {
    return new DataLoader<Oid, ChipEntity>(async (keys) =>
      this.chipRepository.getManyForChipSetsByOpaqueIds(keys),
    );
  }
}
