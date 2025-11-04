import { Outlet } from "react-router-dom"

import { useAuth } from "../context/useAuth"




const AdminRoutes =  () => {
    
 const {isLoggedIn,isAuthenticating} = useAuth()
 
 if(isAuthenticating)return<div>Loading........</div>

    return(
        
       <div className = 'flex h-screen overflow-hidden'>
           {isLoggedIn ? (
        <>
         

          <div className=' flex-1 overflow-y-auto bg-gray-50'>
            <Outlet />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          
        </div>
      )}
       </div>
    )


}

export default AdminRoutes