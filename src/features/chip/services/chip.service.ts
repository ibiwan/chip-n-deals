import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { UUID } from 'crypto';

import { OwnableObjectService } from '@/types';
import { ID } from '@/util/auth.util';

import {
  ChipSet,
  ChipSetEntity,
  ChipSetRepository,
  ChipSetService,
} from '@/features/chipSet';
import { PlayerEntity, PlayerMapper } from '@/features/player';

import { Chip, ChipEntity, CreateChipDto } from '../schema';

import { ChipRepository } from './chip.repository';
import { ChipMapper, PostMapped } from './chip.mapper';

@Injectable()
export class ChipService implements OwnableObjectService<Chip, ChipSet> {
  constructor(
    @Inject(forwardRef(() => ChipSetService))
    private chipSetService: ChipSetService,
    @Inject(forwardRef(() => ChipSetRepository))
    private chipSetRepository: ChipSetRepository,
    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,

    @InjectEntityManager() private em: EntityManager,
    private chipRepository: ChipRepository,

    private chipMapper: ChipMapper,
  ) {}

  @PostMapped
  async get(id: ID): Promise<Chip> {
    let chipEntity: ChipEntity;
    if (Number.isInteger(id)) {
      chipEntity = await this.chipRepository.oneById(id as number);
    } else {
      chipEntity = await this.chipRepository.oneByOid(id as UUID);
    }

    return this.chipMapper.domainFromDb(chipEntity);
  }

  // @PostMapped<ChipEntity, Chip>()
  async chipByDbId(id: number): Promise<Chip> {
    const chipEntity = await this.chipRepository.oneById(id);

    return this.chipMapper.domainFromDb(chipEntity);
  }

  // @PostMapped<ChipEntity, Chip>()
  async chipByOpaqueId(opaqueId: UUID): Promise<Chip> {
    const chipEntity = await this.chipRepository.oneByOid(opaqueId);

    return this.chipMapper.domainFromDb(chipEntity);
  }

  // @PostMapped<ChipEntity[], Chip[]>()
  async findByIds(ids: readonly number[]): Promise<(Chip | Error)[]> {
    const chipEntities = await this.chipRepository.getManyByIds(ids);

    return this.chipMapper.domainFromDbMany(chipEntities);
  }

  // @PostMapped<ChipEntity[], Chip[]>()
  async allChips(): Promise<Chip[]> {
    const chipEntities = await this.chipRepository.getAll();

    return this.chipMapper.domainFromDbMany(chipEntities);
  }

  // @PostMapped<ChipEntity[], Chip[]>()
  async chipsForChipSet(id: number): Promise<Chip[]> {
    const chipEntities = await this.chipRepository.getManyForChipSetById(id);

    return this.chipMapper.domainFromDbMany(chipEntities);
  }

  // @PostMapped<ChipEntity[], Chip[]>()
  async chipsForChipSets(ids: readonly number[]): Promise<Chip[]> {
    const chipEntities = await this.chipRepository.getManyForChipSetsByIds(ids);

    return this.chipMapper.domainFromDbMany(chipEntities);
  }

  // @PostMapped<ChipEntity[], Chip[]>()
  async chipsForChipSetsByOpaqueIds(ids: readonly UUID[]): Promise<Chip[]> {
    const chipEntities =
      await this.chipRepository.getManyForChipSetsByOpaqueIds(ids);

    return this.chipMapper.domainFromDbMany(chipEntities);
  }

  // @PostMapped<ChipEntity, Chip>()
  async create(
    createChipDto: CreateChipDto,
    owner: PlayerEntity,
  ): Promise<Chip> {
    const { chipSetOpaqueId } = createChipDto;

    const chipSetEntity: ChipSetEntity = await this.chipSetRepository.oneByOid(
      chipSetOpaqueId,
    );

    if (!chipSetEntity) {
      throw Error('specified chipSet does not exist');
    }

    const chipEntity = await this.chipMapper.dbFromDto(
      createChipDto,
      chipSetEntity,
      owner,
    );

    await this.em.save(chipEntity);

    return this.chipMapper.domainFromDb(chipEntity);
  }

  async getParent(chip: Chip) {
    return {
      item: chip.chipSet,
      serviceType: typeof ChipSetService,
    };
  }

  getOwner(_chip: Chip): Promise<number> {
    throw new Error('Method not implemented: ChipService:getOwner');
  }

  getAllOwners(_chip: Chip): Promise<(number | symbol)[]> {
    throw new Error('Method not implemented: ChipService:getAllOwners');
  }
}
