import { NestDataLoader } from 'nestjs-dataloader';
import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';

import { PlayerEntity } from '../schema/player.db.entity';
import { PlayerRepository } from '../schema/player.repository';
import { Oid } from '@/types/misc.types';

export type PlayerByOpaqueIdLoader = DataLoader<Oid, PlayerEntity>;

@Injectable()
export class PlayerByOpaqueIdFactory
  implements NestDataLoader<Oid, PlayerEntity>
{
  constructor(private playerRepository: PlayerRepository) {}

  generateDataLoader(): PlayerByOpaqueIdLoader {
    return new DataLoader<Oid, PlayerEntity>(async (keys) =>
      this.playerRepository.getManyByOpaqueIds(keys),
    );
  }
}
