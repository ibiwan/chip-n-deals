import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';
import * as _ from 'lodash';

import {
  ChipEntityModel,
  CreateChipDto,
} from '@/features/chip/schema/chip.gql.model';
import {
  ChipSetEntityModel,
  CreateChipSetDto,
} from '@/features/chipSet/chipSet/chipSet.entityModel';
import { PlayerEntityModel } from '@/features/player/schema/player.entityModel';

import { ChipDbRow, ChipSetDbRow } from '@test/helpers/types';

export const testChipSetDbRows: ChipSetDbRow[] = [
  {
    id: 4,
    name: 'vegas',
    opaqueId: '245d1b45-6437-4fbb-95a3-92bce5cb55de',
    ownerId: 1,
  },
  {
    id: 7,
    name: 'atlantic',
    opaqueId: '53fdc649-d3d2-4847-8813-732fdc8217a9',
    ownerId: 1,
  },
];

export const testChipDbRows: ChipDbRow[] = [
  {
    id: 2,
    color: 'yed',
    value: 99,
    chipSetOpaqueId: '245d1b45-6437-4fbb-95a3-92bce5cb55de',
    ownerId: 1,
  },
  {
    id: 6,
    color: 'pinkle',
    value: 91,
    chipSetOpaqueId: '245d1b45-6437-4fbb-95a3-92bce5cb55de',
    ownerId: 1,
  },
  {
    id: 12,
    color: 'pucett',
    value: 1,
    chipSetOpaqueId: '245d1b45-6437-4fbb-95a3-92bce5cb55de',
    ownerId: 1,
  },
  {
    id: 87,
    color: 'ruschia',
    value: 100,
    chipSetOpaqueId: '53fdc649-d3d2-4847-8813-732fdc8217a9',
    ownerId: 1,
  },
];

export const testChipSetEMs = testChipSetDbRows.map((row: ChipSetDbRow) => {
  const set = new ChipSetEntityModel(row.name, []);
  set.id = row.id;
  set.opaqueId = row.opaqueId;
  set.ownerId = row.ownerId;

  return set;
});

export const testChipSetEmLookup: { (oid: UUID): ChipSetEntityModel } =
  testChipSetEMs.reduce((acc, cur) => {
    acc[cur.opaqueId] = cur;
    return acc;
  }, {}) as { (oid: UUID): ChipSetEntityModel };

export const testChipEMs: ChipEntityModel[] = testChipDbRows.map((row) => {
  const chip = new ChipEntityModel(
    row.color,
    row.value,
    testChipSetEmLookup[row.chipSetOpaqueId],
  );
  chip.id = row.id;
  chip.ownerId = row.ownerId;
  testChipSetEmLookup[row.chipSetOpaqueId].chips.push(chip);
  return chip;
});

export const testChipDtos: CreateChipDto[] = testChipDbRows.map((row) =>
  _.pick(row, ['color', 'value', 'chipSetOpaqueId']),
);

export const testChipSetDtos: CreateChipSetDto[] = testChipSetDbRows.map(
  (row: ChipSetDbRow) => {
    const { name, opaqueId } = row;
    const chips = testChipDtos
      .filter(({ chipSetOpaqueId }) => chipSetOpaqueId == opaqueId)
      .map((chip) => _.omit(chip, 'chipSetOpaqueId'));

    return {
      name,
      chips,
    };
  },
);

export const testOrphanChipEMs = testChipDbRows.map(
  (row) => new ChipEntityModel(row.color, row.value),
);

export const testAdminLP = { username: 'admin', password: 'passify' };
const testAdminPassHash = bcrypt.hashSync(testAdminLP.password, 2);
export const testAdmin = new PlayerEntityModel('admin', testAdminPassHash);
