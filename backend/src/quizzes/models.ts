import { Model, RelationMappings } from "objection";
import { Choice, Question } from "../questions";
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

  async createQuestion(nChoices = 4): Promise<Question> {
    const currentQuestion = await this.$relatedQuery("questions")
      .orderBy("rank", "desc")
      .first()
      .withGraphFetched("choices");
    if (currentQuestion && !currentQuestion.isAnswered()) {
      throw new Error(`Quiz ${this.id} has unanswered question`);
    }
    const randomEquations = await Equation.query()
      .orderByRaw("random()")
      .limit(nChoices);
    const correctEquationId = _.sample(randomEquations)?.id;
    // To ensure stable order of questions, they are returned sorted by ID by
    // default. While creating, sort them here in application side. Later they
    // are sorted by the database server.
    const choiceIds = randomEquations.map(() => uuidv4());
    choiceIds.sort();
    const choices = _.zip(randomEquations, choiceIds).map(([equation, id]) => ({
      id,
      equationId: equation?.id,
      isCorrect: equation?.id === correctEquationId,
    }));
    const question = await this.$relatedQuery("questions")
      .allowGraph("choices")
      .insertGraph({
        id: uuidv4(),
        rank: _.toInteger(currentQuestion?.rank) + 1,
        choices,
      });
    // It's ugly but (probably) required to associate equations with choices. I
    // can't include them in the insertGraph() above because they're note being
    // inserted.
    _.zip(question.choices as Choice[], randomEquations as Equation[]).forEach(
      ([choice, equation]) => {
        if (choice && equation) {
          choice.equation = equation;
        }
      }
    );
    return question;
  }
}
