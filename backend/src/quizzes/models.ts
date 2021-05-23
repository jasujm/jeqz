import { Model, RelationMappings } from "objection";
import { Question } from "../questions";
import { Equation } from "../equations";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

export class Quiz extends Model {
  id!: string;
  questions?: Question[];

  static tableName = "quizzes";

  static get relationMappings(): RelationMappings {
    return {
      questions: {
        relation: Model.HasManyRelation,
        modelClass: Question,
        join: {
          from: "quizzes.id",
          to: "questions.quizId",
        },
      },
    };
  }

  static create(): Promise<Quiz> {
    return Quiz.query().insert({
      id: uuidv4(),
    });
  }

  currentQuestion() {
    return this.$relatedQuery("questions").orderBy("rank", "desc").first();
  }

  async createQuestion(nChoices = 4): Promise<Question> {
    const current = await this.currentQuestion().withGraphFetched("choices");
    if (current && !current.isAnswered()) {
      throw new Error(`Quiz ${this.id} has unanswered question`);
    }
    const randomEquations = await Equation.query()
      .select("id")
      .orderByRaw("random()")
      .limit(nChoices);
    const correctEquationId = _.sample(randomEquations)?.id;
    return await this.$relatedQuery<Question>("questions").insertGraph({
      id: uuidv4(),
      rank: _.toInteger(current?.rank) + 1,
      choices: randomEquations.map((equation) => ({
        id: uuidv4(),
        equationId: equation.id,
        isCorrect: equation.id === correctEquationId,
      })),
    });
  }
}
