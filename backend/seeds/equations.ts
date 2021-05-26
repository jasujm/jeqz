import { Knex } from "knex";
import faker from "faker";
import _ from "lodash";

export async function seed(knex: Knex): Promise<void> {
  await knex("equations").del();
  await knex("equations").insert(
    _.range(10).map((n) => {
      const discoverer = faker.name.lastName();
      return {
        id: faker.datatype.uuid(),
        name: `${discoverer} equation`,
        markup: `a + b = c \\quad \\mathrm{${discoverer}}`,
      };
    })
  );
}
