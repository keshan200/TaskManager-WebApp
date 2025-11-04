import apiClient, { BASE_URL } from "./apiClient"

const AUTH_URL = `${BASE_URL}/auth`



export interface SignUpResponse{
    name:string

    email : string
    id : string
}


export interface LoginResponse {
    name:string
    
    AccessToken:string
    email : string
    
    id : string
}

export interface LogoutResponse{
    message:string
}




export const login = async (loginData: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await apiClient.post(`${AUTH_URL}/login`,loginData)
    console.log("Backend Response: ", response.data)
    return response.data
}

export const logout =  async () : Promise<LoginResponse> => {
    const response = await apiClient.post(`${AUTH_URL}/logout`)
    return response.data
}