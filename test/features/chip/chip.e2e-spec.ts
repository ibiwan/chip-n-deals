import * as supertest from 'supertest';
import { UUID } from 'crypto';
import * as _ from 'lodash';

import { INestApplication } from '@nestjs/common';

import {
  ChipEntityModel,
  CreateChipDto,
} from '@/features/chip/chip.entityModel';
import { logger } from '@/util/logger';

import { getTestRootModule } from '@test/helpers/testing.module';
import {
  createChip,
  getAllChips,
  getChipsForSet,
} from '@test/querystrings/test.chip.querystrings';
import {
  SuperClient,
  gqlChipFromDbEntity,
  createChipDtoFromDbRow,
  gqlChipFromChipDto,
} from '@test/helpers/types';
import { persistToDb } from '@test/helpers/test.database.utils';
import {
  testAdmin,
  testAdminLP,
  testChipDbRows,
  testChipEMs,
  testChipSetDbRows,
  testChipSetEMs,
} from '@test/fixtures/test.init.data';

const getTestApp = async () => {
  const testApp = (await getTestRootModule()).createNestApplication();
  return testApp;
};

describe('Chips graphql (e2e)', () => {
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
      await app.close();
    }
  });

  it('gets allChips', async () => {
    const expectedChips = testChipEMs.map((chip) =>
      _.omit(chip, ['id', 'chipSet.id', 'chipSet.chips', 'chipSetId']),
    );

    const result = await httpClient
      .post('/graphql')
      .set('Authorization', `Bearer ${access_token}`)
      .send({ query: getAllChips });

    const fetchedChips: ChipEntityModel[] = result?.body?.data?.allChips;
    if (!fetchedChips) {
      logger.error('test response malformed', result.text);
    }

    expect(fetchedChips).toEqual(expectedChips);
  });

  it('gets chipsForChipSet', async () => {
    const testChipSet = testChipSetDbRows[0];
    const { opaqueId } = testChipSet;
    const expectedChips = testChipEMs
      .filter((chip) => chip.chipSet == testChipSet)
      .map((chip) => gqlChipFromDbEntity(chip));

    const result = await httpClient
      .post('/graphql')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        query: getChipsForSet,
        variables: { chipset_opaque_id: opaqueId },
      });

    const fetchedChips: ChipEntityModel[] = result?.body?.data?.chipsForChipSet;
    if (!fetchedChips) {
      logger.error('test response malformed', result.text);
    }

    expect(fetchedChips).toEqual(expectedChips);
  });

  it('creates new chip for chipSet', async () => {
    const testChipDto: CreateChipDto = createChipDtoFromDbRow(
      testChipDbRows[0],
    );
    const testChipSetEM = testChipSetEMs[0];

    const { opaqueId } = testChipSetEM;

    const expectedChip = gqlChipFromChipDto(testChipDto, testChipSetEM);

    const inputChip: CreateChipDto = {
      ...testChipDto,
      chipSetOpaqueId: opaqueId,
    };

    const result = await httpClient
      .post('/graphql')
      .set('Authorization', `Bearer ${access_token}`)
      .send({
        query: createChip,
        variables: { chipData: inputChip },
      });

    const createdChip: ChipEntityModel = result?.body?.data?.createChip;
    if (!createdChip) {
      logger.error('test response malformed', result.text);
    }

    expect(createdChip.opaqueId).toBeInstanceOf<UUID>;
    createdChip.opaqueId = null;

    expect(createdChip).toEqual(expectedChip);
  });
});
