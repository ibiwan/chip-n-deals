import * as supertest from 'supertest';
import { UUID } from 'crypto';
import * as _ from 'lodash';

import { INestApplication } from '@nestjs/common';

import { ChipSetEntityModel } from '@/features/chipSet/chipSet/chipSet.entityModel';

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
  testChipSetDbRows,
} from '@test/fixtures/test.init.data';
import exp from 'constants';
import { PlayerEntityModel } from '@/features/player/schema/player.entityModel';

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
      console.log('test response malformed', result.text);
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
    const targetChipSet = testChipSetDtos[0];

    const { opaqueId } = targetChipSet;

    // const nonDbChipSet = _.omit(targetChipSet, 'id', 'ownerId');
    // const expectedChipSet = {
    //   ...nonDbChipSet,
    //   chips: _.sortBy(targetChipSet.chips, 'id').map((chip) =>
    //     _.omit(chip, ['id', 'ownerId', 'chipSet', 'chipSetId']),
    //   ),
    //   // .map((c) => (c.owner = testAdmin)),
    // };

    // expectedChipSet.chips.forEach((chip) => {
    //   chip.owner = { username: testAdmin.username } as PlayerEntityModel;
    // });

    // console.log({ chips: targetChipSet.chips });

    const result = await httpClient
      .post('/graphql')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        query: getChipSet,
        variables: { opaque_id: opaqueId },
      });

    const fetchedChipSet: ChipSetEntityModel = result?.body?.data?.chipSet;
    if (!fetchedChipSet) {
      console.log('test response malformed', result.text);
    }

    console.log({ targetChipSetDb });
    console.log({ fetchedChipSet, c: fetchedChipSet.chips });

    // expect(fetchedChipSet).toEqual(expectedChipSet);
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
      console.log('test response malformed', result.text);
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
