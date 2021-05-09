import { Model } from "objection";

export class Equation extends Model {
  id!: string;
  name!: string;
  markup!: string;

  static tableName = "equations";
}
