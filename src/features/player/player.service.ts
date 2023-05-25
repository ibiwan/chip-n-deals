import { EntityManager } from 'typeorm';
import { UUID } from 'crypto';

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

import { AuthService } from '@/auth/authentication/authn.service';
import { SqlBool } from '@/datasource/sqlite.util';
import { logger, shortStack } from '@/util/logger';

import {
  CreatePlayerDto,
  PlayerEntityModel,
  PlayerRepository,
} from './player.entityModel';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerEntityModel)
    private playerRepository: PlayerRepository,

    @InjectEntityManager()
    private em: EntityManager,

    @Inject(forwardRef(/* istanbul ignore next */ () => AuthService))
    private authService: AuthService,
  ) {}

  async playerById(opaqueId: UUID): Promise<PlayerEntityModel> {
    logger.trace('player.service:this.playerRepository.findOneBy', {
      opaqueId,
      stack: shortStack(),
    });
    return this.playerRepository.findOneBy({ opaqueId });
  }

  async playerByUsername(username: string): Promise<PlayerEntityModel> {
    logger.trace('player.service:this.playerRepository.findOneBy', {
      username,
      stack: shortStack(),
    });

    return this.playerRepository.findOneBy({ username });
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<PlayerEntityModel> {
    const { username, password } = createPlayerDto;
    const passhash = this.authService.hashPassword(password);
    const player = new PlayerEntityModel(username, passhash);
    await this.em.save(player);

    return player;
  }

  async createAdmin(
    adminName: string,
    adminHash: string,
  ): Promise<PlayerEntityModel> {
    const player = new PlayerEntityModel(adminName, adminHash);
    player.isAdmin = SqlBool.True;
    await this.em.save(player);

    return player;
  }
}
