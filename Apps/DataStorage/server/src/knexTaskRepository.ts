import Knex from "knex";
import { rootServer } from "@rootsdk/server-app";

const knex = Knex({
  client: "sqlite3",
  connection: { filename: rootServer.dataStore.config.sqlite3!.filename },
  useNullAsDefault: true,
});

export interface TaskModel {
  id: number;
  text: string;
}

const taskTableName: string = "tasks";

export class KnexTaskRepository {
  public async create(text: string): Promise<TaskModel> {
    const [id] = await knex(taskTableName).insert({ text });

    return await knex(taskTableName).where({ id }).first() as TaskModel;
  }

  public async list(): Promise<TaskModel[]> {
    return await knex(taskTableName).select() as TaskModel[];
  }

  public async delete(id: number): Promise<number> {
    return await knex(taskTableName).where({ id }).del();
  }
}

export async function initializeKnex() {
  const hasTable = await knex.schema.hasTable(taskTableName);

  if (!hasTable) {
    await knex.schema.createTable(taskTableName, (table) => {
      table.increments("id").primary();
      table.text("text");
    });
  }
}

export const taskRepository = new KnexTaskRepository();