import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { DBEntity, GqlModel, DomainObjectMapper } from '@/types';

import {
  ChipSetEntity,
  ChipSetMapper,
  ChipSet,
  ChipSetModel,
} from '@/features/chipSet';
import {
  Player,
  PlayerEntity,
  PlayerMapper,
  PlayerModel,
} from '@/features/player';

import { Chip, ChipModel, ChipEntity, CreateChipDto } from '../schema';

export function PostMapped(target, context) {
  // descriptor.enumerable = value;
  console.log({ target, context });
}

@Injectable()
export class ChipMapper implements DomainObjectMapper<Chip> {
  constructor(
    @Inject(forwardRef(() => ChipSetMapper))
    private chipSetMapper: ChipSetMapper,

    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,
  ) {}

  async dbFromDto(
    dto: CreateChipDto,
    chipSetEntity: ChipSetEntity,
    ownerEntity: PlayerEntity,
  ): Promise<ChipEntity> {
    const chipEntity = ChipEntity.from(
      dto,
      //   {
      //   chipSet: chipSetEntity,
      //   owner: ownerEntity,
      // }
    );
    chipEntity.chipSet = chipSetEntity;
    chipEntity.owner = ownerEntity;
    chipEntity.ownerId = ownerEntity.id;

    return chipEntity;
  }

  dbFromDtoMany(
    createChipDtos: CreateChipDto[],
    chipSetEntity: ChipSetEntity,
    ownerEntity: PlayerEntity,
  ): Promise<ChipEntity[]> {
    const chipEntityPromises = createChipDtos.map((createChipDto) =>
      this.dbFromDto(createChipDto, chipSetEntity, ownerEntity),
    );
    return Promise.all(chipEntityPromises);
  }

  async dbFromDomainMany(
    chips: Chip[],
    chipSetEntity: ChipSetEntity = null,
    nested = false,
  ): Promise<ChipEntity[]> {
    const chipEntityPromises = chips.map((chip) =>
      this.dbFromDomain(chip, chipSetEntity, nested),
    );

    return Promise.all(chipEntityPromises);
  }

  async dbFromGqlMany(
    _mod: GqlModel<Chip>[],
    ..._more: any
  ): Promise<DBEntity<Chip>[]> {
    throw new Error('Method not implemented.');
  }

  async gqlFromDomainMany(
    chips: Chip[],
    isNested = false,
  ): Promise<ChipModel[]> {
    const chipModelPromises = chips.map((chip) =>
      this.gqlFromDomain(chip, isNested),
    );
    return Promise.all(chipModelPromises);
  }

  async gqlFromDbMany(chipEntities: ChipEntity[]): Promise<ChipModel[]> {
    const chipEntityModelPromises = chipEntities.map((chipEntity) =>
      this.gqlFromDb(chipEntity),
    );
    return Promise.all(chipEntityModelPromises);
  }

  async domainFromDb(
    chipEntity: ChipEntity,
    chipSet: ChipSet = null,
    nested = false,
  ): Promise<Chip> {
    let useChipSet: ChipSet = chipSet;
    if (useChipSet == null && chipEntity.chipSet !== null && nested == false) {
      useChipSet = ChipSet.from(chipEntity.chipSet);
    }

    const owner: Player = chipEntity.owner
      ? await this.playerMapper.domainFromDb(chipEntity.owner)
      : null;

    return Chip.from(chipEntity, { chipSet: useChipSet, owner });
  }

  async gqlFromDomain(chip: Chip, isNested = false): Promise<ChipModel> {
    let useChipSetModel: ChipSetModel = chip.chipSet;
    if (!isNested) {
      useChipSetModel = await this.chipSetMapper.gqlFromDomain(
        chip.chipSet,
        true,
      );
    }

    const ownerModel: PlayerModel = chip.owner
      ? await this.playerMapper.gqlFromDomain(chip.owner)
      : null;

    const chipModel = new ChipModel(
      chip.color,
      chip.value,
      useChipSetModel,
      ownerModel,
    );
    chipModel.opaqueId = chip.opaqueId;
    return chipModel;
  }

  async dbFromDomain(
    chip: Chip,
    chipSetEntity: ChipSetEntity = null,
    nested = false,
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

  async domainFromDbMany(
    chipEntities: ChipEntity[],
    chipSet: ChipSet = null,
    nested = false,
  ): Promise<Chip[]> {
    const chipPromises =
      chipEntities?.map((chipEntity) =>
        this.domainFromDb(chipEntity, chipSet, nested),
      ) ?? [];

    return Promise.all(chipPromises);
  }

  async gqlFromDb(_chipEntity: ChipEntity): Promise<ChipModel> {
    throw new Error('Method not implemented: ChipMapper:gqlFromDb');
  }

  async dbFromGql(_chipModel: ChipModel): Promise<ChipEntity> {
    throw new Error('Method not implemented: ChipMapper:dbFromGql');
  }
}
