import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { PlayerRepository, PlayerEntity } from '../schema';
import { PlayerDataByIdLoader, PlayerIdType } from './player.loader.types';

@Injectable()
export class PlayerByIdLoader
  implements NestDataLoader<PlayerIdType, PlayerEntity>
{
  constructor(private playerRepository: PlayerRepository) {}

  generateDataLoader(): PlayerDataByIdLoader {
    return new DataLoader<PlayerIdType, PlayerEntity>(async (keys) => {
      const playerEntities = await this.playerRepository.getManyByIds(keys);

      const sortedPlayerEntities = keys.map((key) =>
        playerEntities.find((set) => set.id == key),
      );

      return sortedPlayerEntities;
    });
  }
}
