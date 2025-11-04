import type { TaskService } from "../types/Task";
import apiClient, { BASE_URL } from "./apiClient";

export const TASK_URL = `${BASE_URL}/task`;



export const getAllTasks = async () => {
  const response = await apiClient.get(`${TASK_URL}/get`)
  return response.data;
};


export const getTaskById = async (id: number) => {
  const response = await apiClient.get(`${TASK_URL}/${id}`);
  return response.data;
};


export const createTask = async (taskData: TaskService) => {
  const response = await apiClient.post(`${TASK_URL}/create`, taskData);
  return response.data;
};


export const updateTask = async (id: number, taskData: TaskService) => {

  console.log("daata",taskData)
  const response = await apiClient.put(`${TASK_URL}/update/${id}`, taskData);
  return response.data;
};



export const deleteTask = async (id: number) => {
  const response = await apiClient.delete(`${TASK_URL}/delete/${id}`);
  return response.data;
};





