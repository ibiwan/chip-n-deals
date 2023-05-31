import { Inject, forwardRef } from '@nestjs/common';

import { PlayerEntity, PlayerMapper } from '@/features/player';
import { ChipMapper, ChipEntity } from '@/features/chip';
import { DomainObjectMapper } from '@/types';

import { ChipSet } from '../schema/chipSet.domain.object';
import { ChipSetEntity } from '../schema/chipSet.db.entity';
import { ChipSetModel } from '../schema/chipSet.gql.model';
import { CreateChipSetDto } from '../schema/chipSet.gql.dto.create';

export class ChipSetMapper implements DomainObjectMapper<ChipSet> {
  constructor(
    @Inject(forwardRef(() => ChipMapper))
    private chipMapper: ChipMapper,
    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,
  ) {}

  async dbFromDto(
    createChipSetDto: CreateChipSetDto,
    ownerEntity: PlayerEntity,
  ): Promise<ChipSetEntity> {
    const { chips: chipDtos } = createChipSetDto;

    const chipSetEntity = ChipSetEntity.from(createChipSetDto, {
      owner: ownerEntity,
    });

    const chipEntities = chipDtos.map((chipDto) =>
      ChipEntity.from(chipDto, { chipSet: chipSetEntity, owner: ownerEntity }),
    );

    chipSetEntity.chips = chipEntities;
    return chipSetEntity;
  }

  async domainFromDbMany(
    chipSetEntities: ChipSetEntity[],
    nested = false,
  ): Promise<ChipSet[]> {
    const chipSetPromises = chipSetEntities.map((chipSetEntity) =>
      this.domainFromDb(chipSetEntity, nested),
    );

    return Promise.all(chipSetPromises);
  }

  async domainFromDb(
    chipSetEntity: ChipSetEntity,
    nested = false,
  ): Promise<ChipSet> {
    const { chips: chipEntities, owner: ownerEntity } = chipSetEntity;

    const chipSet = new ChipSet(
      chipSetEntity.name,
      chipSetEntity.id,
      chipSetEntity.opaqueId,
      null,
      null,
    );

    let chips = null;
    if (chipEntities !== null && nested == false) {
      chips = await this.chipMapper.domainFromDbMany(
        chipSetEntity.chips,
        chipSet,
        true,
      );
    }

    const owner = ownerEntity
      ? await this.playerMapper.domainFromDb(chipSetEntity.owner)
      : null;

    chipSet.chips = chips;
    chipSet.owner = owner;

    return chipSet;
  }

  async gqlFromDomain(
    chipSet: ChipSet,
    isNested = false,
  ): Promise<ChipSetModel> {
    const chipModels = chipSet?.chips
      ? await this.chipMapper.gqlFromDomainMany(chipSet.chips, isNested)
      : null;
    const ownerModel = chipSet.owner
      ? await this.playerMapper.gqlFromDomain(chipSet?.owner)
      : null;
    const chipSetModel = new ChipSetModel(
      chipSet.opaqueId,
      chipSet.name,
      chipModels,
      ownerModel,
    );

    return chipSetModel;
  }

  async dbFromDomain(chipSet: ChipSet, nested = false): Promise<ChipSetEntity> {
    const { chips, owner } = chipSet;
    const ownerEntity = owner
      ? await this.playerMapper.dbFromDomain(owner)
      : null;

    const chipSetEntity = new ChipSetEntity(
      chipSet.opaqueId,
      chipSet.name,
      null,
      ownerEntity,
    );
    let chipEntities: ChipEntity[];
    if (chips != null && nested == false) {
      chipEntities = await this.chipMapper.dbFromDomainMany(
        chips,
        chipSetEntity,
        true,
      );
    }
    // FIXME: assign chipEntities
    return chipSetEntity;
  }

  async gqlFromDb(_ent: ChipSetEntity): Promise<ChipSetModel> {
    throw new Error('Method not implemented: ChipSetMapper:gqlFromDb');
  }

  async dbFromGql(_mod: ChipSetModel): Promise<ChipSetEntity> {
    throw new Error('Method not implemented: ChipSetMapper:dbFromGql');
  }

  async dbFromDtoMany(_dto: CreateChipSetDto[]): Promise<ChipSetEntity[]> {
    throw new Error('Method not implemented.');
  }

  async dbFromDomainMany(_obj: ChipSet[]): Promise<ChipSetEntity[]> {
    throw new Error('Method not implemented.');
  }

  async dbFromGqlMany(_mod: ChipSetModel[]): Promise<ChipSetEntity[]> {
    throw new Error('Method not implemented.');
  }

  async gqlFromDomainMany(_obj: ChipSet[]): Promise<ChipSetModel[]> {
    throw new Error('Method not implemented: ChipSetMapper:');
  }

  async gqlFromDbMany(_ent: ChipSetEntity[]): Promise<ChipSetModel[]> {
    throw new Error('Method not implemented: ChipSetMapper:gqlFromDbMany');
  }
}
