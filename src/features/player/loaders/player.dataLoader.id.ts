import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { PlayerRepository } from '../schema/player.repository';
import { PlayerEntity } from '../schema/player.db.entity';
import { Id } from '@/types/misc.types';

export type PlayerByIdLoader = DataLoader<Id, PlayerEntity>;

@Injectable()
export class PlayerByIdFactory implements NestDataLoader<Id, PlayerEntity> {
  constructor(private playerRepository: PlayerRepository) {}

  generateDataLoader(): PlayerByIdLoader {
    return new DataLoader<Id, PlayerEntity>(async (keys) =>
      this.playerRepository.getManyByIds(keys),
    );
  }
}
