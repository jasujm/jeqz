import { expect, request } from "../test/helpers";
import "../test/db";
import { Equation } from "./models";
import app from "../app";

describe("equations", () => {
  let equations!: Equation[];

  beforeAll(async () => {
    equations = await Equation.query();
  });

  describe("index", () => {
    it("should list all equations", async () => {
      const res = await request(app.callback()).get("/equations");
      expect(res).to.have.status(200).and.to.be.json;
      expect(res.body).to.deep.equal(equations);
    });
  });

  describe("read", () => {
    it("should read a single equation", async () => {
      const equation = equations[0];
      const res = await request(app.callback()).get(
        `/equations/${equation.id}`
      );
      expect(res).to.have.status(200).and.to.be.json;
      expect(res.body).to.deep.equal(equation);
    });
  });
});
