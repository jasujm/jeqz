import { Model, RelationMappings, raw } from "objection";
import { Quiz } from "../quizzes";
import { Equation } from "../equations";
import _ from "lodash";

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

  async answer(choiceRank: number | string): Promise<void> {
    const intendedChoice = _.head(
      await this.$relatedQuery("choices")
        .select("isSelected")
        .where("rank", choiceRank)
    );
    if (!intendedChoice) {
      throw new Error(`Question ${this.id} does not have choice ${this.rank}`);
    } else if (intendedChoice.isSelected !== null) {
      throw new Error(`Question ${this.id} is already answered`);
    }
    await this.$relatedQuery("choices").patch({
      isSelected: raw("?? = ?", "rank", choiceRank),
    });
  }
}

export class Choice extends Model {
  questionId!: string;
  equationId!: string;
  rank!: number;
  isCorrect!: boolean;
  isSelected: boolean | null = null;
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
