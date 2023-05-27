// world
import { EntityManager, In } from 'typeorm';
import { UUID } from 'crypto';

// framework
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common';

// other modules
import { Ownable } from '@/auth/ownership/ownable.interface';
import { shortStack } from '@/util/logger.class';
import { ID } from '@/auth/auth.util';

import { ChipSet } from '@/features/chipSet/schema/chipSet.domain.object';
import { ChipSetService } from '@/features/chipSet/chipSet.service';

// this module
import { ChipEntity, ChipRepository } from './schema/chip.db.entity';
import { Chip } from './schema/chip.domain.object';
import { CreateChipDto } from './schema/chip.gql.dto.create';
import { Player } from '../player/schema/player.domain.object';

@Injectable()
export class ChipService implements Ownable<Chip, ChipSet> {
  constructor(
    @InjectRepository(ChipEntity)
    private chipRepository: ChipRepository,

    // forwardRef accommodates circular references
    @Inject(forwardRef(/* istanbul ignore next */ () => ChipSetService))
    private chipSetService: ChipSetService,

    @InjectEntityManager()
    private em: EntityManager,
  ) {}

  private readonly logger = new Logger(this.constructor.name);

  async get(id: ID): Promise<Chip> {
    this.logger.verbose(`get: id = ${id}`);

    if (Number.isInteger(id)) {
      return this.chipByDbId(id as number);
    }
    return this.chipByOpaqueId(id as UUID);
  }

  async chipByDbId(id: number): Promise<Chip> {
    this.logger.verbose(
      `chipByDbId: chipRepository.findOneBy(${id})`,
      shortStack(),
    );
    return (await this.chipRepository.findOneBy({ id })).toDomainObject();
  }

  async chipByOpaqueId(opaqueId: UUID): Promise<Chip> {
    this.logger.verbose(
      `chipByOpaqueId: chipRepository.findOneBy(${opaqueId})`,
      shortStack(),
    );
    return (await this.chipRepository.findOneBy({ opaqueId })).toDomainObject();
  }

  async findByIds(ids: readonly number[]): Promise<(Chip | Error)[]> {
    this.logger.verbose(
      `findByIds: chipRepository.findBy([${ids.join(', ')}])`,
      shortStack(),
    );

    return (await this.chipRepository.findBy({ id: In(ids) })).map(
      (chipEntity) => chipEntity.toDomainObject(),
    );
  }

  async allChips(): Promise<Chip[]> {
    this.logger.verbose(`allChips: chipRepository.find()`, shortStack());

    return (await this.chipRepository.find()).map((chipEntity) =>
      chipEntity.toDomainObject(),
    );
  }

  async chipsForChipSet(id: number): Promise<Chip[]> {
    this.logger.verbose(
      `chipsForChipSet: chipRepository.findBy(${id})`,
      shortStack(),
    );

    return (await this.chipRepository.findBy({ id })).map((chipEntity) =>
      chipEntity.toDomainObject(),
    );
  }

  async chipsForChipSets(ids: readonly number[]): Promise<Chip[]> {
    this.logger.verbose(
      `chipsForChipSets: chipRepository.findBy([${ids.join(', ')}])`,
      shortStack(),
    );

    const chipEntities = await this.chipRepository.findBy({
      chipSetId: In(ids),
    });
    return chipEntities.map((chipEntity) => chipEntity.toDomainObject());
  }

  async createChipForChipSet(
    createChipDto: CreateChipDto,
    chipSet: ChipSet,
    owner: Player,
  ): Promise<Chip> {
    this.logger.verbose(
      `createChipModelForChipSetEntity: color = ${
        createChipDto.color
      }, chipSet = ${chipSet?.id ?? chipSet?.name}, owner = ${owner.username}`,
    );

    const chip = createChipDto.toDomainObject(chipSet, owner);

    return chip;
  }

  async create(createChipDto: CreateChipDto, owner: Player): Promise<Chip> {
    this.logger.verbose(
      `create: color = ${createChipDto.color}, chipSet = ${createChipDto.chipSetOpaqueId}, owner = ${owner.username}`,
    );

    const { chipSetOpaqueId } = createChipDto;
    const chipSet = await this.chipSetService.chipSet(chipSetOpaqueId);

    if (!chipSet) {
      throw Error('specified chipSet does not exist');
    }

    const chip = createChipDto.toDomainObject(chipSet, owner);
    await this.em.save(ChipEntity.fromDomainObject(chip));

    return chip;
  }

  async getParent(chip: Chip) {
    this.logger.verbose(`getParent`);

    return {
      item: chip.chipSet,
      serviceType: typeof ChipSetService,
    };
  }

  getOwner(chip: Chip): Promise<number> {
    this.logger.verbose(`getOwner`);

    throw new Error('Method not implemented.');
  }

  getAllOwners(chip: Chip): Promise<(number | symbol)[]> {
    this.logger.verbose(`getAllOwners`);

    throw new Error('Method not implemented.');
  }
}
