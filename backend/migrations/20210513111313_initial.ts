import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("equations", (table) => {
    table.uuid("id").primary().notNullable();
    table.string("name").unique().notNullable();
    table.string("markup", 1023).notNullable();
    table.string("wikipediaId", 31).notNullable();
    table.dateTime("wikipediaTimestamp").notNullable();
    table.timestamp("createdAt", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
  await knex.schema.createTable("quizzes", (table) => {
    table.uuid("id").notNullable().primary();
    table.timestamp("createdAt", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
  await knex.schema.createTable("questions", (table) => {
    table.uuid("id").notNullable().primary();
    table.uuid("quizId").notNullable();
    table.integer("rank").notNullable();
    table.unique(["quizId", "rank"]);
    table.timestamp("createdAt", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    table.timestamp("updatedAt", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });
  await knex.schema.createTable("choices", (table) => {
    table.uuid("id").notNullable().primary();
    table.uuid("questionId").notNullable();
    table.uuid("equationId").notNullable();
    table.boolean("isCorrect").notNullable();
    table.boolean("isSelected").nullable();
    table.unique(["questionId", "equationId"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("choices");
  await knex.schema.dropTableIfExists("questions");
  await knex.schema.dropTableIfExists("quizzes");
  await knex.schema.dropTableIfExists("equations");
}
