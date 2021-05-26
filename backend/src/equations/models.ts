import { QueryBuilder, raw } from "objection";
import { TimestampModel } from "../db";

export class Equation extends TimestampModel {
  id!: string;
  name!: string;
  markup!: string;
  wikipediaId!: string;
  wikipediaTimestamp!: string;
  retrievedAt?: string;

  static modifiers = {
    defaultSelect(query: QueryBuilder<Equation>): void {
      query.select(
        "id",
        "name",
        "markup",
        "wikipediaId",
        "wikipediaTimestamp",
        raw("coalesce(??, ??)", "updated_at", "created_at").as("retrievedAt")
      );
    },
  };

  static tableName = "equations";
}
