import * as DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';

import { Injectable } from '@nestjs/common';

import { ChipSetEntityModel } from './chipSet.entityModel';
import { ChipSetService } from './chipSet.service';

@Injectable()
export class ChipSetLoader
  implements NestDataLoader<number, ChipSetEntityModel>
{
  constructor(private readonly chipSetService: ChipSetService) {}

  generateDataLoader(): DataLoader<number, ChipSetEntityModel> {
    return new DataLoader<number, ChipSetEntityModel>(async (keys) => {
      const chipSets = await this.chipSetService.chipSetsByIds(keys);

      const sortedChipSets = keys.map((key) =>
        chipSets.find((set) => set.id == key),
      );

      return sortedChipSets;
    });
  }
}
