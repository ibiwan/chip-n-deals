import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { getTestRootModule } from '@test/helpers/testing.module';
import {
  SuperClient,
  TestChipsSetsData,
  createChipsAndSet,
  testChipSet,
} from '@test/fixtures/test.init.data';
import {
  createChipSet,
  getChipSet,
} from '../querystrings/test.chipset.querystrings';
import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';


const getTestApp = async () => {
  const testApp = (await getTestRootModule()).createNestApplication();
  return testApp;
};

describe('ChipSets graphql (e2e)', () => {
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

  it('gets chipSet by id', async () => {
    const targetChipSet = testChipSetsData.testChipSets[0];
    const { opaqueId } = targetChipSet;

    const expectedChipSet = {
      ...targetChipSet,
      chips: _.sortBy(targetChipSet.chips, 'id').map((chip) =>
        _.omit(chip, ['id', 'chipSet']),
      ),
    };

    const result = await httpClient.post('/graphql').send({
      query: getChipSet,
      variables: { opaque_id: opaqueId },
    });

    const fetchedChipSet: ChipSetEntityModel = result?.body?.data?.chipSet;
    if (!fetchedChipSet) {
      console.log(result.text);
    }

    expect(fetchedChipSet).toEqual(expectedChipSet);
  });

  it('creates a chipSet', async () => {
    const result = await httpClient.post('/graphql')
      .send({
        query: createChipSet,
        variables: { chipSetData: testChipSet }
      })

    const createdChipSet: ChipSetEntityModel = result?.body?.data?.createChipSet;
    if (!createdChipSet) {
      console.log(result.text);
    }

    expect(createdChipSet.opaqueId).not.toBeNull;

    const anonCreatedChipSet = _.omit(createdChipSet, 'opaqueId')
    expect(anonCreatedChipSet).toEqual(testChipSet)
  })
});
