import type { User } from "./User"; 

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  user?: User; 
}

export interface TaskService {
  id?: number;
  title: string;
  description?: string;
  completed?: boolean;
  userId?: number;
}
