import { UUID } from 'crypto';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import {
  ChipEntityModel,
  CreateChipDto,
} from '@/features/chip/chip.entityModel';
import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';

export type SuperClient = supertest.SuperTest<supertest.Test>;

export interface ChipDbRow {
  id: number;
  color: string;
  value: number;
  chipSetOpaqueId: UUID;
}

export interface ChipSetDbRow {
  id: number;
  name: string;
  opaqueId: UUID;
}

export const gqlChipFromDbEntity = (
  chipDbEntity: ChipEntityModel,
  shallow = false,
): ChipEntityModel => {
  const {
    color,
    value,
    chipSet: { name, opaqueId },
  } = chipDbEntity;
  const chipGqlModel = new ChipEntityModel(color, value);
  if (!shallow) {
    chipGqlModel.chipSet = { name, opaqueId } as ChipSetEntityModel;
  }

  return chipGqlModel;
};

export const createChipDtoFromDbRow = (chipDbRow: ChipDbRow): CreateChipDto => {
  const { color, value } = chipDbRow;

  return new ChipEntityModel(color, value);
};

export const gqlChipFromChipDto = (
  chipDto: CreateChipDto,
  chipSetEm: ChipSetEntityModel = null,
): ChipEntityModel => {
  const chipSetGqlModel = _.omit(chipSetEm, ['id']);

  const chipGqlModel = new ChipEntityModel(
    chipDto.color,
    chipDto.value,
    ...(chipSetEm ? [chipSetGqlModel] : []),
  );

  return chipGqlModel;
};

export const gqlChipSetFromDbEntity = (chipSetDbEntity: ChipSetEntityModel) => {
  const { name, opaqueId, chips } = chipSetDbEntity;

  const useChips = chips.map((chipEnt) => gqlChipFromDbEntity(chipEnt, true));

  const chipSetGqlModel = new ChipSetEntityModel(name, useChips);
  chipSetGqlModel.opaqueId = opaqueId;

  return chipSetGqlModel;
};

export const shallowGqlChipFromDbEntity = (
  chipDbEntity: ChipEntityModel,
): ChipEntityModel => {
  const { color, value } = chipDbEntity;
  const chipShallowGqlModel = new ChipEntityModel(color, value);

  return chipShallowGqlModel;
};

// export const
/**
      const nonDbChipSet = _.omit(targetChipSet, 'id');


    const expectedChipSet = {
      ...nonDbChipSet,
      chips: _.sortBy(targetChipSet.chips, 'id').map(
        (chip) =>
          _.omit(chip, ['id', 'chipSet']),
      ),
    };

    const anonCreatedChipSet = _.omit(createdChipSet, 'opaqueId')
 */
