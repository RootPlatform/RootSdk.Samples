import Knex from "knex";
import { Database } from "sqlite3";
import { rootServer } from "@rootsdk/server-app";
import { SuggestionBoxError } from "@suggestionbox/shared";

const knex = Knex({
  client: "sqlite3",
  connection: { filename: rootServer.dataStore.config.sqlite3!.filename },
  useNullAsDefault: true,
  pool: {
    afterCreate: (conn: Database, done: (err?: Error | null) => void) => {
      conn.run("PRAGMA foreign_keys = ON", (err) => {
        done(err);
      });
    },
  },
});

export interface SuggestionModel {
  id: number;
  author_id: string;
  text: string;
  voter_ids: string[];
  created_at: string;
}

const suggestionTableName: string = "suggestions";
const voteTableName: string = "votes";

export class SuggestionRepository {
  // Parameters: the author's ID and the suggestion text
  // Returns: the newly created suggestion or null if the suggestion text already exists
  public async create(author_id: string, text: string): Promise<SuggestionModel | null> {

    // Don't allow duplicate suggestions
    if (await knex(suggestionTableName).where({ text }).first()) {
      return null;
    }

    const [id] = await knex(suggestionTableName).insert({
      author_id,
      text,
    });

    return this.getById(id) as Promise<SuggestionModel>;
  }

  // Parameters: the suggestion ID
  // Returns: the suggestion with the given ID, or null if not found
  public async getById(id: number): Promise<SuggestionModel | null> {
    const suggestion = await knex(suggestionTableName).where({ id }).first();

    if (!suggestion) {
      return null;
    }

    const voterIds = await knex(voteTableName)
      .where({ suggestion_id: id })
      .pluck("user_id");

    return { ...suggestion, voter_ids: voterIds };
  }

  // Parameters: none
  // Returns: an array of all suggestions
  public async list(): Promise<SuggestionModel[]> {
    // Build a map of all suggestion IDs to the user IDs who voted for each suggestion
    const allVotes = await knex(voteTableName).select(
      "suggestion_id",
      "user_id"
    ) as Array<{ suggestion_id: number; user_id: string }>;

    const votesMap: Record<number, string[]> = {};

    for (const vote of allVotes) {
      if (!votesMap[vote.suggestion_id]) {
        votesMap[vote.suggestion_id] = [];
      }

      votesMap[vote.suggestion_id].push(vote.user_id);
    }

    // Fetch all suggestions, then augment them with the voter IDs for that suggestion
    const allSuggestions = await knex(suggestionTableName).select() as Array<Omit<SuggestionModel, 'voter_ids'>>;

    return allSuggestions.map((suggestion) => ({
      ...suggestion,
      voter_ids: votesMap[suggestion.id] || [],
    }));
  }

  // Parameters: the suggestion ID and the new text
  // Returns: the updated suggestion, or null if the suggestion was not found
  public async update(id: number, text: string): Promise<SuggestionModel | null> {
    const affectedRows = await knex(suggestionTableName)
      .where({ id })
      .update({ text });

    if (affectedRows === 0) {
      return null;
    }

    return await this.getById(id);
  }

  // Parameters: the suggestion ID
  // Returns: the number of rows deleted
  public async delete(id: number): Promise<number> {
    return await knex(suggestionTableName).where({ id }).del();
  }

  // Parameters: suggestion ID and user ID
  // Returns: the updated suggestion, or an error if the suggestion doesn't exist or the user already voted for this suggestion
  public async addVote(suggestion_id: number, user_id: string): Promise<SuggestionModel | SuggestionBoxError> {
    try {
      if (!(await this.getById(suggestion_id))) {
        return SuggestionBoxError.NOT_FOUND;
      }

      await knex(voteTableName).insert({ suggestion_id, user_id });

      return (await this.getById(suggestion_id)) ?? SuggestionBoxError.NOT_FOUND;

    } catch (error: unknown) {
      if ((error as { code?: string }).code === "SQLITE_CONSTRAINT") {
        return SuggestionBoxError.DUPLICATE_VOTE;
      }

      throw error;
    }
  }
}

async function createSuggestionTable() {
  const hasTable = await knex.schema.hasTable(suggestionTableName);

  if (!hasTable) {
    await knex.schema.createTable(suggestionTableName, (table) => {
      table.increments("id").primary();
      table.string("author_id").notNullable();
      table.text("text");
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
}

async function createVoteTable() {
  const hasTable = await knex.schema.hasTable(voteTableName);

  if (!hasTable) {
    await knex.schema.createTable(voteTableName, (table) => {
      table.increments("id").primary();
      table
        .integer("suggestion_id")
        .notNullable()
        .references("id")
        .inTable(suggestionTableName)
        .onDelete("CASCADE");
      table.string("user_id").notNullable();
      table.unique(["suggestion_id", "user_id"]); // Prevent duplicate votes
    });
  }
}

export async function initializeDatabase() {
  await createSuggestionTable();
  await createVoteTable();
}

export const suggestionRepository = new SuggestionRepository();
