import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { getTestRootModule } from './testing.module';
import {
  SuperClient,
  TestChipsSetsData,
  createChipsAndSet,
} from './test.init.data';
import { getAllChips, getChipsForSet } from './test.querystrings';
import { ChipEntityModel } from '@/features/chip/chip.entityModel';

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
});
