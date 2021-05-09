import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("equations", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("name").unique().notNullable();
    table.string("markup", 1023).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("equations");
}
