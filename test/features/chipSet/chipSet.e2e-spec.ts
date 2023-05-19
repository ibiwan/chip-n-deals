import { INestApplication } from '@nestjs/common';
import * as supertest from 'supertest';
import * as _ from 'lodash';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';

import { getTestRootModule } from '@test/helpers/testing.module';
import {
  createChipSet,
  getAllChipSets,
  getChipSet,
} from '@test/querystrings/test.chipset.querystrings';
import { SuperClient, gqlChipSetFromDbEntity } from '@test/helpers/types';
import { clearDB, persistToDb } from '@test/helpers/test.database.utils';
import { testChipSetEMs, testChipSetDtos } from '@test/fixtures/test.init.data';

const getTestApp = async () => {
  const testApp = (await getTestRootModule()).createNestApplication();
  return testApp;
};

describe('ChipSets graphql (e2e)', () => {
  let app: INestApplication;
  let httpClient: SuperClient;

  beforeEach(async () => {
    app = await getTestApp();
    await app.init();
    await persistToDb(app, ...testChipSetEMs); // will cascade to chips
    httpClient = supertest(app.getHttpServer());
  });

  afterEach(async () => {
    if (app) {
      await clearDB(app);

      await app.close();
    }
  });

  it('gets all chipSets', async () => {
    const targetChipSets = testChipSetEMs;
    const expectedChipSets = targetChipSets.map(gqlChipSetFromDbEntity);

    const result = await httpClient.post('/graphql').send({
      query: getAllChipSets,
    });

    const fetchedChipSets: ChipSetEntityModel[] =
      result?.body?.data?.allChipSets;
    if (!fetchedChipSets) {
      console.log(result.text);
    }

    expect(fetchedChipSets).toEqual(expectedChipSets);
  });

  it('gets chipSet by id', async () => {
    const targetChipSet = testChipSetEMs[0];
    const { opaqueId } = targetChipSet;

    const nonDbChipSet = _.omit(targetChipSet, 'id');
    const expectedChipSet = {
      ...nonDbChipSet,
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
    const testChipSetDto = testChipSetDtos[0];

    const result = await httpClient.post('/graphql').send({
      query: createChipSet,
      variables: { chipSetData: testChipSetDto },
    });

    const createdChipSet: ChipSetEntityModel =
      result?.body?.data?.createChipSet;
    if (!createdChipSet) {
      console.log(result.text);
    }

    expect(createdChipSet.opaqueId).not.toBeNull;

    const anonCreatedChipSet = _.omit(createdChipSet, 'opaqueId');
    expect(anonCreatedChipSet).toEqual(testChipSetDto);
  });
});
