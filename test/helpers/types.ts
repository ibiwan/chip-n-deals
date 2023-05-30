import * as supertest from 'supertest';
import { UUID } from 'crypto';
import * as _ from 'lodash';

export type SuperClient = supertest.SuperTest<supertest.Test>;

export interface ChipDbRow extends ChipCore {
  id: number;
  opaqueId: UUID;
  color: string;
  value: number;
  chipSetId: number;
  ownerId: number;
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

  const chip = new CreateChipDto();
  chip.color = color;
  chip.value = value;
  return chip;
};

export const gqlChipFromChipDto = (
  chipDto: CreateChipDto,
  chipSetEm: ChipSetEntityModel = null,
): ChipEntityModel => {
  const chipSetGqlModel = _.omit(chipSetEm, ['id', 'owner', 'ownerId']);

  const chipGqlModel = new ChipEntityModel(
    chipDto.color,
    chipDto.value,
    ...(chipSetEm ? [chipSetGqlModel as ChipSetEntityModel] : []),
  );
  chipGqlModel.opaqueId = null;

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
  chipShallowGqlModel.opaqueId = null;

  return chipShallowGqlModel;
};
