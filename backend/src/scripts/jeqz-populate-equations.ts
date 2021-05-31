import parse from "csv-parse";
import { Equation } from "../equations";
import "../db";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";

const parser = parse();
let headers: string[] | null = null;
const inserts: Promise<Equation>[] = [];

function makeEquation(record: readonly string[]) {
  return _(headers)
    .zip(record)
    .fromPairs()
    .thru((record) => ({
      id: uuidv4(),
      name: record.name,
      markup: record.markup,
      wikipediaId: record.id,
      wikipediaTimestamp: record.timestamp,
    }))
    .value() as Equation;
}

parser.on("readable", () => {
  let record;
  while ((record = parser.read())) {
    if (headers === null) {
      headers = record;
    } else {
      const equation = makeEquation(record);
      inserts.push(Equation.query().insert(equation));
    }
  }
});

parser.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

parser.on("end", () => {
  console.log(`inserting ${inserts.length} equations`);
  Promise.all(inserts)
    .then(() => {
      console.log("done!");
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
});

process.stdin.on("data", (chunk) => {
  parser.write(chunk);
});

process.stdin.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

process.stdin.on("end", () => {
  parser.end();
});
