import * as DataLoader from 'dataloader';
import { NestDataLoader } from 'nestjs-dataloader';

import { Injectable, Logger } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './schema/player.domain.object';
import { PlayerEntity } from './schema/player.db.entity';

export type PlayerIdType = PlayerEntity['id'];
export type PlayerDataLoader = DataLoader<PlayerIdType, Player>;

@Injectable()
export class PlayerLoader implements NestDataLoader<PlayerIdType, Player> {
  constructor(private readonly playerService: PlayerService) {}

  private readonly logger = new Logger(this.constructor.name);

  generateDataLoader(): PlayerDataLoader {
    return new DataLoader<PlayerIdType, Player>(async (keys) => {
      this.logger.verbose(`Player: keys = ${keys.join(', ')}`);

      const chipSets = await this.playerService.playersByIds(keys);

      const sortedChipSets = keys.map((key) =>
        chipSets.find((set) => set.id == key),
      );

      return sortedChipSets;
    });
  }
}
