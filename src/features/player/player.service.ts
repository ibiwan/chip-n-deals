import { EntityManager } from 'typeorm';
import { UUID, randomUUID } from 'crypto';

import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

import { AuthorizationService } from '@/auth/authentication/authn.service';

import {
  PlayerRepository,
  CreatePlayerDto,
  PlayerMapper,
  Player,
} from './schema';

@Injectable()
export class PlayerService {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,

    @Inject(forwardRef(() => AuthorizationService))
    private authService: AuthorizationService,

    private playerRepository: PlayerRepository,
    private playerMapper: PlayerMapper,
  ) {}

  async playerByOpaqueId(opaqueId: UUID): Promise<Player> {
    const playerEntity = await this.playerRepository.getOneByOpaqueId(opaqueId);

    return this.playerMapper.domainFromDb(playerEntity);
  }

  async playerById(id: number): Promise<Player> {
    const playerEntity = await this.playerRepository.getOneById(id);

    return this.playerMapper.domainFromDb(playerEntity);
  }

  async playersByIds(ids: readonly number[]): Promise<Player[]> {
    const playerEntities = await this.playerRepository.getManyByIds(ids);

    return this.playerMapper.domainFromDbMany(playerEntities);
  }

  async playerByUsername(username: string): Promise<Player> {
    const playerEntity = await this.playerRepository.getOneByUsername(username);

    return playerEntity ? this.playerMapper.domainFromDb(playerEntity) : null;
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { username, password } = createPlayerDto;

    const passhash = this.authService.hashPassword(password);

    const player = new Player(username, passhash);

    const playerEntity = await this.playerMapper.dbFromDomain(player);
    await this.em.save(playerEntity);

    return this.playerMapper.domainFromDb(playerEntity);
  }

  async createAdmin(adminName: string, adminHash: string): Promise<Player> {
    const player = new Player(adminName, adminHash);
    player.isAdmin = true;
    player.opaqueId = randomUUID();

    const playerEntity = await this.playerMapper.dbFromDomain(player);

    await this.em.save(playerEntity);

    return this.playerMapper.domainFromDb(playerEntity);
  }
}
