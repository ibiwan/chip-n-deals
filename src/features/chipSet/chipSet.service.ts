import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UUID } from 'crypto';

import { OwnableObjectService } from '@/util/root.types';
import { ID } from '@/auth/auth.util';

import { Player } from '@/features/player';

import {
  chipSetCreateDtoToDomainObject,
  ChipSetRepository,
  CreateChipSetDto,
  ChipSetEntity,
  ChipSetMapper,
  ChipSet,
} from './schema';
import { Unowned } from '@/auth/authorization/owned.decorator';

@Injectable()
export class ChipSetService implements OwnableObjectService<ChipSet, null> {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,

    private chipSetRepository: ChipSetRepository,
    private chipSetMapper: ChipSetMapper,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  async get(id: ID): Promise<ChipSet> {
    if (Number.isInteger(id)) {
      return this.chipSetById(id as number);
    }
    return this.chipSet(id as UUID);
  }

  async allChipSets(): Promise<ChipSet[]> {
    const chipSetEntities = await this.chipSetRepository.getAll();

    return this.chipSetMapper.domainFromDbMany(chipSetEntities);
  }

  async chipSet(opaqueId: UUID): Promise<ChipSet> {
    const chipSetEntity: ChipSetEntity =
      await this.chipSetRepository.getOneByOpaqueId(opaqueId);

    return this.chipSetMapper.domainFromDb(chipSetEntity);
  }

  async chipSetById(id: number): Promise<ChipSet> {
    const chipSetEntity = await this.chipSetRepository.getOneById(id);
    return this.chipSetMapper.domainFromDb(chipSetEntity);
  }

  async chipSetsByIds(ids: readonly number[]): Promise<ChipSet[]> {
    const chipSetEntities = await this.chipSetRepository.getManyByIds(ids);
    return this.chipSetMapper.domainFromDbMany(chipSetEntities);
  }

  async chipSetsByOpaqueIds(ids: readonly UUID[]): Promise<ChipSet[]> {
    const chipSetEntities = await this.chipSetRepository.getManyByOpaqueIds(
      ids,
    );
    return this.chipSetMapper.domainFromDbMany(chipSetEntities);
  }

  async create(data: CreateChipSetDto, owner: Player): Promise<ChipSet> {
    const chipSet: ChipSet = chipSetCreateDtoToDomainObject(data, owner);

    const chipSetEntity = await this.chipSetMapper.dbFromDomain(chipSet);

    await this.em.save(chipSetEntity);

    return this.chipSetMapper.domainFromDb(chipSetEntity);
  }

  async getParent(_chipSet: ChipSet) {
    return null;
  }

  async getOwner(chipSet: ChipSet): Promise<number> {
    return chipSet?.owner?.id;
  }

  async getAllOwners(chipSet: ChipSet): Promise<(number | symbol)[]> {
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
