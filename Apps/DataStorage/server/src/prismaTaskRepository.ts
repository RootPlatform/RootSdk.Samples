import { PrismaClient, TaskRecord } from '../dist/prismaClient';
import { rootServer } from '@rootsdk/server-app';

const dbPath = rootServer.dataStore.config.sqlite3!.filename;
process.env.DATABASE_URL = `file:${dbPath}`;

const prisma: PrismaClient = new PrismaClient();

export interface TaskModel {
  id: number;
  text: string;
}

export class PrismaTaskRepository {
  async create(text: string): Promise<TaskModel> {
    const result: TaskRecord = await prisma.taskRecord.create({
      data: { text },
    });
    return { id: result.id, text: result.text };
  }

  async list(): Promise<TaskModel[]> {
    const results: TaskRecord[] = await prisma.taskRecord.findMany();
    return results.map((task: TaskRecord) => ({ id: task.id, text: task.text }));
  }

  async delete(id: number): Promise<number> {
    const deleted: TaskRecord = await prisma.taskRecord.delete({ where: { id } });
    return deleted.id;
  }
}

export const taskRepository: PrismaTaskRepository = new PrismaTaskRepository();

export async function initializePrisma(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS TaskRecord (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL
    );
  `);
}
