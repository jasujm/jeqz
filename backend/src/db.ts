import Knex from "knex";
import { Model } from "objection";
import config from "../knexfile";

const knex = Knex(
  config[(process.env.NODE_ENV || "production") as keyof typeof config]
);

Model.knex(knex);

export default knex;
