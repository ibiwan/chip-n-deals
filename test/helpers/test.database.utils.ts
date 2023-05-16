import { INestApplication } from '@nestjs/common';
import { EntityManager } from 'typeorm';

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
  return await Promise.all(entities.map((entity) => em.save(entity)));
};
