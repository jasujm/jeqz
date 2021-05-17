import { expect, request } from "../test/helpers";
import "../test/db";
import { Quiz } from "./models";
import app from "../app";

describe("quizzes/routes", () => {
  describe("create", () => {
    let res!: ChaiHttp.Response;

    beforeAll(async () => {
      res = await request(app.callback()).post("/quizzes");
    });

    it("should respond with the correct status code", () => {
      expect(res).to.have.status(201);
    });

    it("should contain location of the quiz", async () => {
      expect(res).to.have.header("Location");
      expect(
        await request(app.callback()).get(res.header.location)
      ).to.have.status(200);
    });

    it("should create quiz in the database", async () => {
      expect(await Quiz.query().findById(res.body.id)).not.to.be.undefined;
    });

    it("should create question in the database", async () => {
      expect(await Quiz.relatedQuery("questions").for(res.body.id)).not.to.be
        .empty;
    });
  });
});
