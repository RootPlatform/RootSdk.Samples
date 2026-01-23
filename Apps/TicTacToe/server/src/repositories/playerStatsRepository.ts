import Knex from "knex";
import { Database } from "sqlite3";
import { rootServer } from "@rootsdk/server-app";

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

export interface PlayerStatsModel {
  id: number;
  user_id: string;
  display_name: string;
  wins: number;
  losses: number;
  draws: number;
  created_at: string;
  updated_at: string;
}

export interface MatchHistoryModel {
  id: number;
  player_x_id: string;
  player_o_id: string | null;
  winner_id: string | null;
  is_ai_game: boolean;
  moves: string; // JSON array
  created_at: string;
}

const playerStatsTableName = "player_stats";
const matchHistoryTableName = "match_history";

export class PlayerStatsRepository {
  public async getOrCreate(userId: string, displayName: string): Promise<PlayerStatsModel> {
    let stats = await knex(playerStatsTableName).where({ user_id: userId }).first();

    if (!stats) {
      const [id] = await knex(playerStatsTableName).insert({
        user_id: userId,
        display_name: displayName,
        wins: 0,
        losses: 0,
        draws: 0,
      });
      stats = await knex(playerStatsTableName).where({ id }).first();
    }

    return stats as PlayerStatsModel;
  }

  public async getByUserId(userId: string): Promise<PlayerStatsModel | null> {
    const stats = await knex(playerStatsTableName).where({ user_id: userId }).first();
    return stats || null;
  }

  public async updateDisplayName(userId: string, displayName: string): Promise<void> {
    await knex(playerStatsTableName)
      .where({ user_id: userId })
      .update({ display_name: displayName, updated_at: knex.fn.now() });
  }

  public async recordWin(userId: string): Promise<void> {
    await knex(playerStatsTableName)
      .where({ user_id: userId })
      .increment("wins", 1)
      .update({ updated_at: knex.fn.now() });
  }

  public async recordLoss(userId: string): Promise<void> {
    await knex(playerStatsTableName)
      .where({ user_id: userId })
      .increment("losses", 1)
      .update({ updated_at: knex.fn.now() });
  }

  public async recordDraw(userId: string): Promise<void> {
    await knex(playerStatsTableName)
      .where({ user_id: userId })
      .increment("draws", 1)
      .update({ updated_at: knex.fn.now() });
  }

  public async getLeaderboard(limit: number = 20, offset: number = 0): Promise<PlayerStatsModel[]> {
    return await knex(playerStatsTableName)
      .orderBy("wins", "desc")
      .orderBy("losses", "asc")
      .limit(limit)
      .offset(offset);
  }

  public async getTotalCount(): Promise<number> {
    const result = await knex(playerStatsTableName).count("* as count").first();
    return (result?.count as number) || 0;
  }

  public async getRank(userId: string): Promise<number> {
    const userStats = await this.getByUserId(userId);
    if (!userStats) return 0;

    const result = await knex(playerStatsTableName)
      .count("* as count")
      .where("wins", ">", userStats.wins)
      .orWhere(function() {
        this.where("wins", "=", userStats.wins).where("losses", "<", userStats.losses);
      })
      .first();

    return ((result?.count as number) || 0) + 1;
  }
}

export class MatchHistoryRepository {
  public async create(
    playerXId: string,
    playerOId: string | null,
    winnerId: string | null,
    isAiGame: boolean,
    moves: Array<{ playerId: string; position: number }>
  ): Promise<MatchHistoryModel> {
    const [id] = await knex(matchHistoryTableName).insert({
      player_x_id: playerXId,
      player_o_id: playerOId,
      winner_id: winnerId,
      is_ai_game: isAiGame,
      moves: JSON.stringify(moves),
    });

    return (await knex(matchHistoryTableName).where({ id }).first()) as MatchHistoryModel;
  }

  public async getByPlayerId(playerId: string, limit: number = 20): Promise<MatchHistoryModel[]> {
    return await knex(matchHistoryTableName)
      .where({ player_x_id: playerId })
      .orWhere({ player_o_id: playerId })
      .orderBy("created_at", "desc")
      .limit(limit);
  }
}

async function createPlayerStatsTable() {
  const hasTable = await knex.schema.hasTable(playerStatsTableName);

  if (!hasTable) {
    await knex.schema.createTable(playerStatsTableName, (table) => {
      table.increments("id").primary();
      table.string("user_id").notNullable().unique();
      table.string("display_name").notNullable();
      table.integer("wins").defaultTo(0);
      table.integer("losses").defaultTo(0);
      table.integer("draws").defaultTo(0);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
}

async function createMatchHistoryTable() {
  const hasTable = await knex.schema.hasTable(matchHistoryTableName);

  if (!hasTable) {
    await knex.schema.createTable(matchHistoryTableName, (table) => {
      table.increments("id").primary();
      table.string("player_x_id").notNullable();
      table.string("player_o_id").nullable();
      table.string("winner_id").nullable();
      table.boolean("is_ai_game").defaultTo(false);
      table.text("moves"); // JSON array
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }
}

export async function initializeDatabase() {
  await createPlayerStatsTable();
  await createMatchHistoryTable();
}

export const playerStatsRepository = new PlayerStatsRepository();
export const matchHistoryRepository = new MatchHistoryRepository();
