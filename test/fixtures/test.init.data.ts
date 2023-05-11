import * as supertest from 'supertest';

import { ChipEntityModel, CreateChipDto } from '@/features/chip/chip.entityModel';
import { ChipSetEntityModel, CreateChipSetDto } from '@/features/chipSet/chipSet.entityModel';

const testChipSetNames = ['testChipSet1', 'testChipSet2'];
const testChipSets = testChipSetNames.map(
  (name) => new ChipSetEntityModel(name, []),
);

const testChips: ChipEntityModel[] = [
  { id: 2, color: 'red', value: 99, chipSet: testChipSets[0] },
  { id: 4, color: 'purple', value: 91, chipSet: testChipSets[0] },
  { id: 7, color: 'puce', value: 1, chipSet: testChipSets[0] },
  { id: 87, color: 'ruschia', value: 100, chipSet: testChipSets[1] },
];

export const testChipSet: CreateChipSetDto = {
  name: 'a set',
  chips: [
    { color: 'orange', value: 2 },
    { color: 'lime', value: 3 },
  ]
}

export const testChip: CreateChipDto = {
  color: 'taupe',
  value: 314159
}

export type SuperClient = supertest.SuperTest<supertest.Test>;

export type TestChipsSetsData = {
  testChips: ChipEntityModel[];
  testChipSets: ChipSetEntityModel[];
};

const createTestChips = async (httpClient: SuperClient) =>
  Promise.all(
    testChipSets.map(async (testChipSet) => {
      const createdSet = (
        await httpClient.post('/chipset/create/' + testChipSet.name).send()
      ).body as ChipSetEntityModel;
      testChipSet.opaqueId = createdSet.opaqueId;
      return createdSet;
    }),
  );

const createTestChipSets = async (httpClient: SuperClient) =>
  Promise.all(
    testChips.map(async (chip) => {
      const createdChip = (
        await httpClient.post('/chip/create').send({
          ...chip,
          chipSetOpaqueId: chip.chipSet.opaqueId,
        })
      ).body as ChipEntityModel;
      chip.chipSet.chips.push(chip);
    }),
  );

export const createChipsAndSet = async (
  httpClient: SuperClient,
): Promise<TestChipsSetsData> => {
  await createTestChips(httpClient);
  await createTestChipSets(httpClient);

  return { testChips, testChipSets };
};
