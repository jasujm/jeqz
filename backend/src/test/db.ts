import knex from "../db";

beforeAll(async () => {
  await knex.migrate.latest();
  await knex.seed.run();
});

afterAll(() => knex.destroy());
