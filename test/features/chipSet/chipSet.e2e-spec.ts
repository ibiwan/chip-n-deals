import * as supertest from 'supertest';
import { UUID } from 'crypto';
import * as _ from 'lodash';

import { INestApplication } from '@nestjs/common';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet.entityModel';
import { logger } from '@/util/logger';

import { getTestRootModule } from '@test/helpers/testing.module';
import {
  createChipSet,
  getAllChipSets,
  getChipSet,
} from '@test/querystrings/test.chipset.querystrings';
import { SuperClient, gqlChipSetFromDbEntity } from '@test/helpers/types';
import { clearDB, persistToDb } from '@test/helpers/test.database.utils';
import {
  testChipSetEMs,
  testChipSetDtos,
  testAdmin,
  testAdminLP,
} from '@test/fixtures/test.init.data';

const getTestApp = async () => {
  const testApp = (await getTestRootModule()).createNestApplication();
  return testApp;
};

describe('ChipSets graphql (e2e)', () => {
  let app: INestApplication;
  let httpClient: SuperClient;
  let access_token: string;

  beforeEach(async () => {
    app = await getTestApp();
    await app.init();
    await persistToDb(app, ...testChipSetEMs); // will cascade to chips
    await persistToDb(app, testAdmin);

    httpClient = supertest(app.getHttpServer());

    const loginResult = await httpClient.post('/auth/login').send(testAdminLP);
    access_token = loginResult.body.access_token;
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

    const result = await httpClient
      .post('/graphql')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        query: getAllChipSets,
      });

    const fetchedChipSets: ChipSetEntityModel[] =
      result?.body?.data?.allChipSets;
    if (!fetchedChipSets) {
      logger.error('test response malformed', result.text);
    }

    expectedChipSets.forEach((set) => {
      set.opaqueId = null;
      set.chips.forEach((chip) => (chip.opaqueId = null));
    });
    fetchedChipSets.forEach((set) => {
      expect(set.opaqueId).toBeInstanceOf<UUID>;
      set.opaqueId = null;
      set.chips.forEach((chip) => {
        expect(chip.opaqueId).toBeInstanceOf<UUID>;
        chip.opaqueId = null;
      });
    });

    expect(fetchedChipSets).toEqual(expectedChipSets);
  });

  it('gets chipSet by id', async () => {
    const targetChipSet = testChipSetEMs[0];
    const { opaqueId } = targetChipSet;

    const nonDbChipSet = _.omit(targetChipSet, 'id');
    const expectedChipSet = {
      ...nonDbChipSet,
      chips: _.sortBy(targetChipSet.chips, 'id').map((chip) =>
        _.omit(chip, ['id', 'chipSet', 'chipSetId']),
      ),
    };

    const result = await httpClient
      .post('/graphql')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        query: getChipSet,
        variables: { opaque_id: opaqueId },
      });

    const fetchedChipSet: ChipSetEntityModel = result?.body?.data?.chipSet;
    if (!fetchedChipSet) {
      logger.error('test response malformed', result.text);
    }

    expect(fetchedChipSet).toEqual(expectedChipSet);
  });

  it('creates a chipSet', async () => {
    const testChipSetDto = testChipSetDtos[0];

    const result = await httpClient
      .post('/graphql')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        query: createChipSet,
        variables: { chipSetData: testChipSetDto },
      });

    const createdChipSet: ChipSetEntityModel =
      result?.body?.data?.createChipSet;
    if (!createdChipSet) {
      logger.error('test response malformed', result.text);
    }

    expect(createdChipSet.opaqueId).toBeInstanceOf<UUID>;

    createdChipSet.chips.forEach((chip) => {
      expect(chip.opaqueId).toBeInstanceOf<UUID>;
      delete chip.opaqueId;
    });

    const anonCreatedChipSet = _.omit(createdChipSet, 'opaqueId');
    expect(anonCreatedChipSet).toEqual(testChipSetDto);
  });
});
