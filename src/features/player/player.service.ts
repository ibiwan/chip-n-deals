import { EntityManager, In } from 'typeorm';
import { UUID } from 'crypto';

import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

import { AuthService } from '@/auth/authentication/authn.service';

import { shortStack } from '@/util/logger.class';
import { PlayerEntity, PlayerRepository } from './schema/player.db.entity';
import { Player } from './schema/player.domain.object';
import { CreatePlayerDto } from './schema/player.gql.dto.create';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerEntity)
    private playerRepository: PlayerRepository,

    @InjectEntityManager()
    private em: EntityManager,

    @Inject(forwardRef(/* istanbul ignore next */ () => AuthService))
    private authService: AuthService,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  async playerByOpaqueId(opaqueId: UUID): Promise<Player> {
    this.logger.verbose(
      `playerById: playerRepository.findOneBy(${opaqueId})`,
      shortStack(),
    );

    return (
      await this.playerRepository.findOneBy({ opaqueId })
    ).toDomainObject();
  }

  async playerById(id: number): Promise<Player> {
    this.logger.verbose(
      `playerById: playerRepository.findOneBy(${id})`,
      shortStack(),
    );

    return (await this.playerRepository.findOneBy({ id })).toDomainObject();
  }

  async playersByIds(ids: readonly number[]): Promise<Player[]> {
    this.logger.verbose(
      `playerById: playerRepository.findBy(${ids})`,
      shortStack(),
    );

    return (await this.playerRepository.findBy({ id: In(ids) })).map(
      (playerEntity) => playerEntity.toDomainObject(),
    );
  }

  async playerByUsername(username: string): Promise<Player> {
    this.logger.verbose(
      `playerByUsername: playerRepository.findOneBy(${username})`,
      shortStack(),
    );
    console.log({ username });
    const playerEntity = await this.playerRepository.findOneBy({ username });
    console.log({ playerEntity });
    return playerEntity?.toDomainObject();
  }

  async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    this.logger.verbose(`create: username = ${createPlayerDto.username}`);

    const { username, password } = createPlayerDto;
    const passhash = this.authService.hashPassword(password);
    const player = new Player(username, passhash);
    await this.em.save(PlayerEntity.fromDomainObject(player));

    return player;
  }

  async createAdmin(adminName: string, adminHash: string): Promise<Player> {
    this.logger.verbose(`createAdmin: username = ${adminName}`);

    const player = new Player(adminName, adminHash);
    player.isAdmin = true;
    console.log({ player });
    const playerEntity = PlayerEntity.fromDomainObject(player);
    console.log({ playerEntity });
    await this.em.save(playerEntity);

    return player;
  }
}
