
import type { User, UserFormData } from "../types/User"
import apiClient, { BASE_URL } from "./apiClient"




export const AUTH_URL = `${BASE_URL}/auth`







export const getAllUsers = async():Promise<User[]> => {
    const response =  await apiClient.get(`${AUTH_URL}/get`,{
        withCredentials:true
    })
    return response.data
}



export const signup =  async (userData :UserFormData) => {

  const formData = new FormData();



  const response = await apiClient.post(`${AUTH_URL}/signup`,formData,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}


export const update_User =  async(_id:string ,userData:Omit<User,"_id">) =>{
     const response = await apiClient.put(`${AUTH_URL}/update/${_id}`,userData)
      return response
}