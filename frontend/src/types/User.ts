import { type Task } from "./Task"; 

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; 
  tasks?: Task[]; 
}


export type UserFormData={
  name: string;
  email: string;
  password?: string; 
  
}