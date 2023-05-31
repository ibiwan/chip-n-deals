import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';
import * as _ from 'lodash';

import {
  ChipDbRow,
  ChipEntity,
  ChipSetDbRow,
  ChipSetEntity,
  CreateChipDto,
  CreateChipSetDto,
  PlayerEntity,
} from '@/features';

export const testChipSetDbRows: ChipSetDbRow[] = [
  {
    id: 4,
    opaqueId: '245d1b45-6437-4fbb-95a3-92bce5cb55de',
    name: 'vegas',
    ownerId: 1,
  },
  {
    id: 7,
    opaqueId: '53fdc649-d3d2-4847-8813-732fdc8217a9',
    name: 'atlantic',
    ownerId: 1,
  },
];

export const testChipDbRows: ChipDbRow[] = [
  {
    id: 2,
    opaqueId: '268e45da-00d3-4dcb-99e8-9b3578700def',
    color: 'yed',
    value: 99,
    chipSetId: 4,
    ownerId: 1,
  },
  {
    id: 6,
    opaqueId: 'f1636767-5069-48be-9455-33fb99b40121',
    color: 'pinkle',
    value: 91,
    chipSetId: 4,
    ownerId: 1,
  },
  {
    id: 12,
    opaqueId: 'efed6e53-0f75-4f95-866f-ef33bb192688',
    color: 'pucett',
    value: 1,
    chipSetId: 4,
    ownerId: 1,
  },
  {
    id: 87,
    opaqueId: '9eddccb5-4bdd-4506-b6bf-ec6a5c34a79e',
    color: 'ruschia',
    value: 100,
    chipSetId: 7,
    ownerId: 1,
  },
];

export const testChipSetEntities: ChipSetEntity[] = testChipSetDbRows.map(
  (chipSetRow: ChipSetDbRow) => {
    const { id, opaqueId, name, ownerId } = chipSetRow;
    return { id, opaqueId, name, chips: [], ownerId } as ChipSetEntity;
  },
);

export const testChipSetEntityLookup: Record<UUID, ChipSetEntity> =
  testChipSetEntities.reduce((table, chipSetEntity) => {
    table[chipSetEntity.opaqueId] = chipSetEntity;
    return table;
  }, {});

export const testChipEntities: ChipEntity[] = testChipDbRows.map((chipRow) => {
  const { opaqueId, color, value, id, ownerId } = chipRow;
  const chipSet = testChipSetEntityLookup[chipRow.opaqueId];
  return { id, opaqueId, color, value, chipSet, ownerId } as ChipEntity;
});

export const testChipDtos: CreateChipDto[] = testChipDbRows.map(
  (chipDb: ChipDbRow) => {
    const { color, value, chipSetId } = chipDb;
    const chipSetOpaqueId = testChipSetDbRows.find(
      (chipSetDb) => (chipSetDb.id = chipSetId),
    ).opaqueId;
    return { color, value, chipSetOpaqueId } as CreateChipDto;
  },
);

export const testChipSetDtos: CreateChipSetDto[] = testChipSetDbRows.map(
  (chipSetRow: ChipSetDbRow) => {
    const { name, opaqueId } = chipSetRow;
    const chips = testChipDtos.filter(
      (chipDto) => chipDto.chipSetOpaqueId == opaqueId,
    );
    return { name, chips } as CreateChipSetDto;
  },
);

export const testOrphanChipEntities = testChipDbRows.map((chipRow) => {
  const { color, value } = chipRow;
  return { color, value } as ChipEntity;
});

export const testAdminLP = { username: 'admin', password: 'passify' };

const testAdminPassHash = bcrypt.hashSync(testAdminLP.password, 2);
export const testAdmin = new PlayerEntity('admin', testAdminPassHash);
