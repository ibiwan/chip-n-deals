import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { ChipEntityModel, CreateChipDto } from '@/features/chip/chip.entityModel';
import { getTestRootModule } from '@test/helpers/testing.module';
import {
  SuperClient,
  TestChipsSetsData,
  createChipsAndSet,
  testChip,
} from '@test/fixtures/test.init.data';
import {
  createChip,
  getAllChips,
  getChipsForSet,
} from '@test/querystrings/test.chip.querystrings';

const getTestApp = async () => {
  const testApp = (await getTestRootModule()).createNestApplication();
  return testApp;
};

describe('Chips graphql (e2e)', () => {
  let app: INestApplication;
  let httpClient: SuperClient;
  let testChipSetsData: TestChipsSetsData;

  beforeAll(async () => {
    app = await getTestApp();
    await app.init();
    httpClient = supertest(app.getHttpServer());
    testChipSetsData = await createChipsAndSet(httpClient);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('gets allChips', async () => {
    const expectedChips = testChipSetsData.testChips.map((chip) =>
      _.omit(chip, ['id', 'chipSet.id', 'chipSet.chips']),
    );

    const result = await httpClient
      .post('/graphql')
      .send({ query: getAllChips });

    const fetchedChips: ChipEntityModel[] = result?.body?.data?.allChips;
    if (!fetchedChips) {
      console.log(result.text);
    }

    expect(fetchedChips).toEqual(expectedChips);
  });

  it('gets chipsForChipSet', async () => {
    const testChipSet = testChipSetsData.testChipSets[0];
    const { opaqueId } = testChipSet;
    const expectedChips = testChipSetsData.testChips
      .filter((chip) => chip.chipSet == testChipSet)
      .map((chip) => _.omit(chip, ['id', 'chipSet.id', 'chipSet.chips']));

    const result = await httpClient.post('/graphql').send({
      query: getChipsForSet,
      variables: { chipset_opaque_id: opaqueId },
    });

    const fetchedChips: ChipEntityModel[] = result?.body?.data?.chipsForChipSet;
    if (!fetchedChips) {
      console.log(result.text);
    }

    expect(fetchedChips).toEqual(expectedChips);
  });

  it('creates new chip for chipSet', async () => {
    const testChipSet = testChipSetsData.testChipSets[0];
    const { name, opaqueId } = testChipSet;

    const expectedChip = {
      ...testChip,
      chipSet: testChipSet
    }

    const inputChip: CreateChipDto = {
      ...testChip,
      chipSetOpaqueId: opaqueId,
    }
    const result = await httpClient.post('/graphql').send({
      query: createChip,
      variables: { chipData: inputChip },
    })
    const createdChip: ChipEntityModel[] = result?.body?.data?.createChip;
    if (!createdChip) {
      console.log(result.text);
    }

    expect(createdChip).toEqual(expectedChip);
  })
});
