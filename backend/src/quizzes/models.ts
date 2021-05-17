import { Model, RelationMappings } from "objection";
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
    const highestRank = await Question.query()
      .where("quizId", this.id)
      .max({ rank: "rank" });
    const randomEquations = await Equation.query()
      .select("id")
      .orderByRaw("random()")
      .limit(nChoices);
    const correctEquationId = _.sample(randomEquations)?.id;
    return await this.$relatedQuery<Question>("questions").insertGraph({
      id: uuidv4(),
      rank: (_.head(highestRank)?.rank || 0) + 1,
      choices: randomEquations.map((equation, index) => ({
        equationId: equation.id,
        rank: index + 1,
        isCorrect: equation.id === correctEquationId,
      })),
    });
  }
}

export class Question extends Model {
  id!: string;
  quizId!: string;
  rank!: number;
  quiz!: Quiz;
  choices?: Choice[];
  equations?: Equation[];

  static tableName = "questions";

  static get relationMappings(): RelationMappings {
    return {
      quiz: {
        relation: Model.BelongsToOneRelation,
        modelClass: Quiz,
        join: {
          from: "questions.quizId",
          to: "quizzes.id",
        },
      },
      choices: {
        relation: Model.HasManyRelation,
        modelClass: Choice,
        join: {
          from: "questions.id",
          to: "choices.questionId",
        },
      },
      equations: {
        relation: Model.ManyToManyRelation,
        modelClass: Equation,
        join: {
          from: "questions.id",
          through: {
            from: "choices.questionId",
            to: "choices.equationId",
          },
          to: "equations.id",
        },
      },
    };
  }
}

export class Choice extends Model {
  questionId!: string;
  equationId!: string;
  rank!: number;
  isCorrect!: boolean;
  question!: Question;
  equation!: Equation;

  static tableName = "choices";
  static idColumn = ["questionId", "equationId"];

  static relationMappings = {
    question: {
      relation: Model.HasOneRelation,
      modelClass: Question,
      join: {
        from: "choices.questionId",
        to: "questions.id",
      },
    },
    equation: {
      relation: Model.HasOneRelation,
      modelClass: Equation,
      join: {
        from: "choices.equationId",
        to: "equations.id",
      },
    },
  };
}
