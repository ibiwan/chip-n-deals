import { EntityManager } from 'typeorm';

import { INestApplication } from '@nestjs/common';

export const clearDB = async (app: INestApplication) => {
  const em = app.get(EntityManager);
  for (const table of ['chip', 'chip_set']) {
    await em.query(`DELETE FROM ${table};`);
  }
};

export const persistToDb = async (
  app: INestApplication,
  ...entities: any[]
) => {
  const em: EntityManager = app.get(EntityManager);
  return Promise.all(entities.map((entity) => em.save(entity)));
};
