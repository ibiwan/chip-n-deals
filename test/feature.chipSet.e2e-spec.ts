import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { getTestRootModule } from './testing.module';
import { SuperClient, TestChipsSetsData, createChipsAndSet } from './test.init.data';
import { getChipSet } from './test.querystrings';
import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';

const getTestApp = async () => {
  const testApp = (await getTestRootModule()).createNestApplication();
  return testApp;
}

describe("ChipSets graphql (e2e)", () => {
  let app: INestApplication;
  let httpClient: SuperClient;
  let testChipSetsData: TestChipsSetsData;

  beforeAll(async () => {
    app = await getTestApp(); await app.init()
    httpClient = supertest(app.getHttpServer())
    testChipSetsData = await createChipsAndSet(httpClient)
  })
  afterAll(async () => { await app.close() })

  it('gets chipSet by id', async () => {
    const targetChipSet = testChipSetsData.testChipSets[0]
    const { opaqueId } = targetChipSet;

    const expectedChipSet = {
      ...targetChipSet,
      chips: _.sortBy(targetChipSet.chips, 'id')
        .map(chip => _.omit(chip, ['id', 'chipSet']))
    }

    const result = await httpClient.post('/graphql').send({
      query: getChipSet,
      variables: { opaque_id: opaqueId }
    })
    const fetchedChipSet: ChipSetEntityModel = result.body.data.chipSet;

    expect(fetchedChipSet).toEqual(expectedChipSet)
  })
})
