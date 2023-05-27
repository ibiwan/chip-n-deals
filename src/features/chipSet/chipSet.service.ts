import { UUID } from 'crypto';
import { EntityManager, In } from 'typeorm';

import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

import { ChipService } from '@/features/chip/chip.service';
import { Ownable } from '@/auth/ownership/ownable.interface';
import { ID } from '@/auth/auth.util';
import { shortStack } from '@/util/logger.class';

import { Unowned } from '@/auth/authorization/authz.entity.guard';
import { ChipSetEntity, ChipSetRepository } from './schema/chipSet.db.entity';
import { ChipSet } from './schema/chipSet.domain.object';
import {
  CreateChipSetDto,
  chipSetCreateDtoToDomainObject,
} from './schema/chipSet.gql.dto.create';
import { Player } from '../player/schema/player.domain.object';
import { ChipEntity } from '../chip/schema/chip.db.entity';

@Injectable()
export class ChipSetService implements Ownable<ChipSet, null> {
  constructor(
    @InjectRepository(ChipSetEntity)
    private chipSetRepository: ChipSetRepository,

    @InjectEntityManager()
    private em: EntityManager,

    // forwardRef accommodates circular references
    @Inject(forwardRef(/* istanbul ignore next */ () => ChipService))
    private chipService: ChipService,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  async get(id: ID): Promise<ChipSet> {
    this.logger.verbose(`get: id = ${id}`);

    if (Number.isInteger(id)) {
      return this.chipSetById(id as number);
    }
    return this.chipSet(id as UUID);
  }

  async allChipSets(): Promise<ChipSet[]> {
    this.logger.verbose(`allChipSets: chipSetRepository.find()`, shortStack());

    return (await this.chipSetRepository.find()).map((chipSet) =>
      chipSet.toDomainObject(),
    );
  }

  async chipSet(opaqueId: UUID): Promise<ChipSet> {
    this.logger.verbose(
      `chipSet: chipSetRepository.findOneBy(${opaqueId})`,
      shortStack(),
    );

    return (
      await this.chipSetRepository.findOneBy({ opaqueId })
    ).toDomainObject();
  }

  async chipSetById(id: number): Promise<ChipSet> {
    this.logger.verbose(
      `chipSetById: chipSetRepository.findOneBy(${id})`,
      shortStack(),
    );

    return (await this.chipSetRepository.findOneBy({ id })).toDomainObject();
  }

  async chipSetsByIds(ids: readonly number[]): Promise<ChipSet[]> {
    this.logger.verbose(
      `chipSetsByIds: chipSetRepository.findBy([${ids.join(', ')}])`,
      shortStack(),
    );

    return (await this.chipSetRepository.findBy({ id: In(ids) })).map(
      (chipSet) => chipSet.toDomainObject(),
    );
  }

  async chipSetsByOpaqueIds(ids: readonly UUID[]): Promise<ChipSet[]> {
    this.logger.verbose(
      `chipSetsByIds: chipSetRepository.findBy([${ids.join(', ')}])`,
      shortStack(),
    );

    return (await this.chipSetRepository.findBy({ opaqueId: In(ids) })).map(
      (chipSet) => chipSet.toDomainObject(),
    );
  }

  async create(data: CreateChipSetDto, owner: Player): Promise<ChipSet> {
    this.logger.verbose(
      `create: name = ${data.name}, owner = ${owner.username}`,
    );

    // this.em.save(owner);

    console.log('a', { data, owner });

    const chipSet: ChipSet = chipSetCreateDtoToDomainObject(data, owner);

    console.log('b', { chipSet });

    const chipSetEntity = ChipSetEntity.fromDomainObject(chipSet);
    for (const chipEntity of chipSetEntity.chips) {
      console.log({ chipEntity });
      await this.em.save(chipEntity);
      console.log('chip saved');
    }
    // chipSetEntity.ownerId = owner.id;
    console.log('c', { chipSetEntity });

    await this.em.save(chipSetEntity);

    console.log('d, saved', { chipSetEntity });

    return chipSetEntity.toDomainObject();
  }

  async getParent(chipSet: ChipSet) {
    this.logger.verbose(`getParent`);

    return null;
  }

  async getOwner(chipSet: ChipSet): Promise<number> {
    this.logger.verbose(`getOwner`);

    return chipSet?.owner?.id;
  }

  async getAllOwners(chipSet: ChipSet): Promise<(number | symbol)[]> {
    this.logger.verbose(`getAllOwners`);

    const firstOwner = await this.getOwner(chipSet);
    // const parent = (await this.getParent(chipSet)).id;

    // when chipsets have parents, get their owners too
    // console.log({ parent });

    const parentOwners = [Unowned];
    const allOwners = [firstOwner, ...parentOwners];
    // console.log({ allOwners });
    return allOwners;
  }
}
