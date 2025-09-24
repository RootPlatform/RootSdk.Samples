import React, { useEffect, useState } from 'react';
import { taskServiceClient, TaskServiceClientEvent } from '@tasks/gen-client';
import {
  Task,
  TaskCreateRequest,
  TaskCreateResponse,
  TaskCreatedEvent,
  TaskListRequest,
  TaskListResponse,
  TaskDeleteRequest,
  TaskDeletedEvent,
} from "@tasks/gen-shared";
const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  //
  // Load current data from server when this client starts
  //

  useEffect(() => {
    const initialize = async () => {
      const request: TaskListRequest = {};
      const response: TaskListResponse = await taskServiceClient.list(request);
      setTasks(response.tasks);
    };

    initialize();
  }, []);

  //
  // Handle when this client creates or deletes tasks
  //

  const createClick = async () => {
    const request: TaskCreateRequest = { text: newTaskText };
    const response: TaskCreateResponse = await taskServiceClient.create(request);

    setTasks(prev => [...prev, response.task!]);
    setNewTaskText('');
  };

  const deleteClick = async (id: number) => {
    const request: TaskDeleteRequest = { id };
    await taskServiceClient.delete(request);

    setTasks(prev => prev.filter(task => task.id !== id));
  };

  //
  // Handle when other clients create or delete tasks
  //
  const handleCreated = (event: TaskCreatedEvent) => { setTasks(prev => [...prev, event.task!]); };
  const handleDeleted = (event: TaskDeletedEvent) => { setTasks(prev => prev.filter(task => task.id !== event.id)); };

  useEffect(() => {
    taskServiceClient.on(TaskServiceClientEvent.Created, handleCreated);
    taskServiceClient.on(TaskServiceClientEvent.Deleted, handleDeleted);

    return () => {
      taskServiceClient.off(TaskServiceClientEvent.Created, handleCreated);
      taskServiceClient.off(TaskServiceClientEvent.Deleted, handleDeleted);
    };
  }, []);

  //
  // UI
  //

  return (
    <div>
      <h1 className="text-xl">Tasks</h1>

      <div>
        <input placeholder="New task" value={newTaskText} onChange={e => setNewTaskText(e.target.value)} />
        <button onClick={createClick}>Create</button>
      </div>

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.text}</span>
            <button onClick={() => deleteClick(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
