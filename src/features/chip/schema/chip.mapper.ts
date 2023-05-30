import { Inject, Injectable, forwardRef } from '@nestjs/common';

import {
  DBEntity,
  DomainObjectMapper,
  DtoObject,
  GqlModel,
} from '@/util/root.types';

import {
  Player,
  PlayerEntity,
  PlayerMapper,
  PlayerModel,
} from '@/features/player';
import { ChipSetEntity, ChipSetMapper, ChipSet } from '@/features/chipSet';

import { Chip } from './chip.domain.object';
import { ChipModel } from './chip.gql.model';
import { ChipEntity } from './chip.db.entity';
import { randomUUID } from 'crypto';
import { CreateChipDto } from './chip.gql.dto.create';

export function PostMapped(target, context) {
  // descriptor.enumerable = value;
  console.log({ target, context });
}

@Injectable()
export class ChipMapper implements DomainObjectMapper<Chip> {
  constructor(
    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,

    @Inject(forwardRef(() => ChipSetMapper))
    private chipSetMapper: ChipSetMapper,
  ) {}

  async dbFromDto(
    dto: CreateChipDto,
    chipSetEntity: ChipSetEntity,
    ownerEntity: PlayerEntity,
  ): Promise<ChipEntity> {
    const chipEntity = new ChipEntity(randomUUID(), dto.color, dto.value);

    chipEntity.chipSet = chipSetEntity;
    chipEntity.owner = ownerEntity;

    return chipEntity;
  }

  async dbFromDomainMany(
    chips: Chip[],
    chipSetEntity: ChipSetEntity = null,
    nested: boolean = false,
  ): Promise<ChipEntity[]> {
    const chipEntityPromises = chips.map((chip) =>
      this.dbFromDomain(chip, chipSetEntity, nested),
    );

    return Promise.all(chipEntityPromises);
  }

  async dbFromGqlMany(
    mod: GqlModel<Chip>[],
    ...more: any
  ): Promise<DBEntity<Chip>[]> {
    throw new Error('Method not implemented.');
  }

  async gqlFromDomainMany(chips: Chip[]): Promise<ChipModel[]> {
    const chipModelPromises = chips.map(this.gqlFromDomain);
    return Promise.all(chipModelPromises);
  }

  async gqlFromDbMany(chipEntities: ChipEntity[]): Promise<ChipModel[]> {
    const chipEntityModelPromises = chipEntities.map(this.gqlFromDb);
    return Promise.all(chipEntityModelPromises);
  }

  async domainFromDb(
    chipEntity: ChipEntity,
    chipSet: ChipSet = null,
  ): Promise<Chip> {
    let useChipSet = chipSet;
    if (useChipSet == null && chipEntity.chipSet !== null) {
      useChipSet =
        chipSet ?? (await this.chipSetMapper.domainFromDb(chipEntity.chipSet));
    }

    const owner: Player = chipEntity.owner
      ? await this.playerMapper.domainFromDb(chipEntity.owner)
      : null;

    return new Chip(
      chipEntity.color,
      chipEntity.value,
      chipEntity.id,
      chipEntity.opaqueId,
      useChipSet,
      owner,
    );
  }

  async gqlFromDomain(chip: Chip): Promise<ChipModel> {
    let useChipSetModel = chip.chipSet
      ? await this.chipSetMapper.gqlFromDomain(chip.chipSet)
      : null;

    const ownerModel: PlayerModel = chip.owner
      ? await this.playerMapper.gqlFromDomain(chip.owner)
      : null;

    return new ChipModel(chip.color, chip.value, useChipSetModel, ownerModel);
  }

  async dbFromDomain(
    chip: Chip,
    chipSetEntity: ChipSetEntity = null,
    nested: boolean = false,
  ): Promise<ChipEntity> {
    let useChipSetEntity = chipSetEntity;
    if (useChipSetEntity == null && nested == false) {
      useChipSetEntity = await this.chipSetMapper.dbFromDomain(
        chip.chipSet,
        true,
      );
    }

    const ownerEntity = await this.playerMapper.dbFromDomain(chip.owner);

    const chipEntity = new ChipEntity(
      chip.opaqueId,
      chip.color,
      chip.value,
      useChipSetEntity,
      ownerEntity,
    );

    return chipEntity;
  }

  async gqlFromDb(chipEntity: ChipEntity): Promise<ChipModel> {
    throw new Error('Method not implemented: ChipMapper:gqlFromDb');
  }

  async dbFromGql(chipModel: ChipModel): Promise<ChipEntity> {
    throw new Error('Method not implemented: ChipMapper:dbFromGql');
  }

  async domainFromDbMany(chipEntities: ChipEntity[]): Promise<Chip[]> {
    const chipPromises =
      chipEntities?.map((chipEntity) => this.domainFromDb(chipEntity)) ?? [];

    return Promise.all(chipPromises);
  }
}
