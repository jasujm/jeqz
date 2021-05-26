import { TimestampModel } from "../db";

export class Equation extends TimestampModel {
  id!: string;
  name!: string;
  markup!: string;

  static tableName = "equations";
}
