import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import {
  PlayerDataByOpaqueIdLoader,
  PlayerIdType,
  PlayerOpaqueIdType,
} from './player.loader.types';
import { PlayerRepository, PlayerEntity } from '../schema';

@Injectable()
export class PlayerByOpaqueIdLoader
  implements NestDataLoader<PlayerIdType, PlayerEntity>
{
  constructor(private playerRepository: PlayerRepository) {}

  generateDataLoader(): PlayerDataByOpaqueIdLoader {
    return new DataLoader<PlayerOpaqueIdType, PlayerEntity>(async (keys) => {
      const playerEntities = await this.playerRepository.getManyByOpaqueIds(
        keys,
      );

      const sortedPlayerEntities = keys.map((key) =>
        playerEntities.find((set) => set.opaqueId == key),
      );

      return sortedPlayerEntities;
    });
  }
}
