import { Model, RelationMappings, raw } from "objection";
import { Quiz } from "../quizzes";
import { Equation } from "../equations";

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

  isAnswered() {
    return this.choices?.every((choice) => choice.isSelected !== null);
  }

  async answer(choiceId: string): Promise<void> {
    const intendedChoice = await this.$relatedQuery("choices")
      .findById(choiceId)
      .select("isSelected");
    if (!intendedChoice) {
      throw new Error(`Question ${this.id} does not have choice ${choiceId}`);
    } else if (intendedChoice.isSelected !== null) {
      throw new Error(`Question ${this.id} is already answered`);
    }
    void (await this.$relatedQuery("choices").patch({
      isSelected: raw("?? = ?", "id", choiceId),
    }));
  }
}

export class Choice extends Model {
  id!: string;
  questionId!: string;
  equationId!: string;
  isCorrect!: boolean;
  isSelected: boolean | null = null;
  question!: Question;
  equation!: Equation;

  static tableName = "choices";

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
