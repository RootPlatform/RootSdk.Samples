export interface TaskModel {
  id: number;
  text: string;
}

export class MemoryTaskRepository {
  private tasks: Map<number, TaskModel> = new Map();
  private nextId: number = 1;

  public async create(text: string): Promise<TaskModel> {
    const newTask: TaskModel = { id: this.nextId++, text };

    this.tasks.set(newTask.id, newTask);

	return newTask;
  }

  public async list(): Promise<TaskModel[]> {
    return Array.from(this.tasks.values());
  }

  public async delete(id: number): Promise<number> {
    const existed = this.tasks.delete(id);
    return existed ? id : -1;
  }
}

export const taskRepository = new MemoryTaskRepository();
