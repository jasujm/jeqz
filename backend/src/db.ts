import Knex from "knex";
import { Model } from "objection";
import config from "../knexfile";

const knex = Knex(
  config[(process.env.NODE_ENV || "production") as keyof typeof config]
);

Model.knex(knex);

export class TimestampModel extends Model {
  createdAt!: string;
  updatedAt!: string;

  $beforeInsert(): void {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate(): void {
    this.updatedAt = new Date().toISOString();
  }
}

export default knex;
