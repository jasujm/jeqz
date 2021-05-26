import Knex from "knex";
import { Model } from "objection";
import config from "../knexfile";

const knex = Knex(
  config[(process.env.NODE_ENV || "production") as keyof typeof config]
);

Model.knex(knex);

export class TimestampModel extends Model {
  created_at!: string;
  updated_at!: string;

  $beforeInsert(): void {
    this.created_at = this.updated_at = new Date().toISOString();
  }

  $beforeUpdate(): void {
    this.updated_at = new Date().toISOString();
  }
}

export default knex;
