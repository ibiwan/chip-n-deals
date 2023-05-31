import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { ChipSetRepository } from '../services';
import { ChipSetEntity } from '../schema';
import { Oid } from '@/types/misc.types';

export type ChipSetByOpaqueIdLoader = DataLoader<Oid, ChipSetEntity>;

@Injectable()
export class ChipSetByOpaqueIdFactory
  implements NestDataLoader<Oid, ChipSetEntity>
{
  constructor(private chipSetRepository: ChipSetRepository) {}

  generateDataLoader(): ChipSetByOpaqueIdLoader {
    return new DataLoader<Oid, ChipSetEntity>(async (keys) =>
      this.chipSetRepository.getManyByOpaqueIds(keys),
    );
  }
}
