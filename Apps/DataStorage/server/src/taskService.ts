import { Client, RootServerException } from "@rootsdk/server-app";
import {
  TaskCreateRequest,
  TaskCreateResponse,
  TaskCreatedEvent,
  TaskListRequest,
  TaskListResponse,
  TaskDeleteRequest,
  TaskDeleteResponse,
  TaskDeletedEvent,
} from "@tasks/gen-shared";
import { TaskServiceBase } from "@tasks/gen-server";

// This App has three options for server-side storage: in-memory, knex + SQLite, and prisma + SQLite.
// Uncomment one of the lines below that match the option you want to use.
import { taskRepository, TaskModel } from "./memoryTaskRepository";
//import { taskRepository, TaskModel } from "./knexTaskRepository";
//import { taskRepository, TaskModel } from "./prismaTaskRepository";

export class TaskService extends TaskServiceBase {
  async create(request: TaskCreateRequest, client: Client): Promise<TaskCreateResponse> {
    const task: TaskModel = await taskRepository.create(request.text);

    const event: TaskCreatedEvent = { task: { id: task.id, text: task.text } };
    this.broadcastCreated(event, "all", client);

    return { task: { id: task.id, text: task.text } };
  }

  async list(request: TaskListRequest, client: Client): Promise<TaskListResponse> {
    const tasks: TaskModel[] = await taskRepository.list();

    return { tasks: tasks.map((t) => ({ id: t.id, text: t.text })) };
  }

  async delete(request: TaskDeleteRequest, client: Client): Promise<TaskDeleteResponse> {
    const result = await taskRepository.delete(request.id);

    if (result === -1) {
      throw new RootServerException(1, `Task ${request.id} not found`);
    }

    const event: TaskDeletedEvent = { id: request.id };
    this.broadcastDeleted(event, "all", client);

    return {};
  }
}

export const taskService = new TaskService();
