import { FeatureRepository } from '@/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { UUID } from 'crypto';

import { PlayerEntity } from './player.db.entity';
import { Player } from './player.domain.object';

@Injectable()
export class PlayerRepository implements FeatureRepository<Player> {
  constructor(
    @InjectRepository(PlayerEntity)
    private playerDsRepository: Repository<PlayerEntity>,
  ) {}

  async getAll(): Promise<PlayerEntity[]> {
    throw new Error('Method not implemented: PlayerRepository:getAll');
  }

  async oneById(id: number): Promise<PlayerEntity> {
    return this.playerDsRepository.findOneBy({ id });
  }

  async oneByOid(opaqueId: UUID): Promise<PlayerEntity> {
    return this.playerDsRepository.findOneBy({ opaqueId });
  }

  async getManyByOpaqueIds(
    opaqueIds: readonly UUID[],
  ): Promise<PlayerEntity[]> {
    return this.playerDsRepository.findBy({ opaqueId: In(opaqueIds) });
  }

  async getOneByUsername(username: string): Promise<PlayerEntity> {
    return this.playerDsRepository.findOneBy({ username });
  }

  async getManyByIds(_ids: readonly number[]): Promise<PlayerEntity[]> {
    throw new Error('Method not implemented: PlayerRepository:getManyByIds');
  }
}
