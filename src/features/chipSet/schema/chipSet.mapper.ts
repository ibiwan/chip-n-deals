import {
  DBEntity,
  DomainObjectMapper,
  DtoObject,
  GqlModel,
} from '@/util/root.types';

import { ChipSetEntity, ChipSetModel, ChipSet } from '.';
import { ChipMapper } from '@/features/chip/schema';
import { Inject, forwardRef } from '@nestjs/common';
import { PlayerMapper } from '@/features/player';

export class ChipSetMapper implements DomainObjectMapper<ChipSet> {
  constructor(
    @Inject(forwardRef(() => ChipMapper))
    private chipMapper: ChipMapper,
    @Inject(forwardRef(() => PlayerMapper))
    private playerMapper: PlayerMapper,
  ) {}
  dbFromDto(dto: DtoObject<ChipSet>, ...more: any): Promise<DBEntity<ChipSet>> {
    throw new Error('Method not implemented.');
  }
  dbFromDomainMany(
    _obj: ChipSet[],
    ...more: any
  ): Promise<DBEntity<ChipSet>[]> {
    throw new Error('Method not implemented.');
  }
  dbFromGqlMany(
    mod: GqlModel<ChipSet>[],
    ...more: any
  ): Promise<DBEntity<ChipSet>[]> {
    throw new Error('Method not implemented.');
  }

  async gqlFromDomainMany(
    _obj: ChipSet[],
    ...more: any
  ): Promise<ChipSetModel[]> {
    throw new Error('Method not implemented: ChipSetMapper:');
  }

  async gqlFromDbMany(
    ent: ChipSetEntity[],
    ...more: any
  ): Promise<ChipSetModel[]> {
    throw new Error('Method not implemented: ChipSetMapper:gqlFromDbMany');
  }

  async domainFromDbMany(
    chipSetEntities: ChipSetEntity[],
    ...more: any
  ): Promise<ChipSet[]> {
    const chipSetPromises = chipSetEntities.map(this.domainFromDb);

    return Promise.all(chipSetPromises);
  }

  async domainFromDb(
    chipSetEntity: ChipSetEntity,
    ...more: any
  ): Promise<ChipSet> {
    const { chips: chipEntities, owner: ownerEntity } = chipSetEntity;
    const chips = chipEntities
      ? await this.chipMapper.domainFromDbMany(chipSetEntity.chips)
      : [];
    const owner = ownerEntity
      ? await this.playerMapper.domainFromDb(chipSetEntity.owner)
      : null;

    return new ChipSet(
      chipSetEntity.name,
      chipSetEntity.id,
      chipSetEntity.opaqueId,
      chips,
      owner,
    );
  }

  async gqlFromDomain(chipSet: ChipSet): Promise<ChipSetModel> {
    const chipModels = chipSet?.chips
      ? await this.chipMapper.gqlFromDomainMany(chipSet.chips)
      : null;
    const ownerModel = await this.playerMapper.gqlFromDomain(chipSet?.owner);
    const chipSetModel = new ChipSetModel(
      chipSet.opaqueId,
      chipSet.name,
      chipModels,
      ownerModel,
    );

    return chipSetModel;
  }

  async dbFromDomain(
    chipSet: ChipSet,
    nested: boolean = false,
  ): Promise<ChipSetEntity> {
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
    let chipEntities;
    if (chips != null && nested == false) {
      chipEntities = await this.chipMapper.dbFromDomainMany(
        chips,
        chipSetEntity,
        true,
      );
    }
    return chipSetEntity;
  }

  async gqlFromDb(ent: ChipSetEntity): Promise<ChipSetModel> {
    throw new Error('Method not implemented: ChipSetMapper:gqlFromDb');
  }

  async dbFromGql(mod: ChipSetModel): Promise<ChipSetEntity> {
    throw new Error('Method not implemented: ChipSetMapper:dbFromGql');
  }
}
