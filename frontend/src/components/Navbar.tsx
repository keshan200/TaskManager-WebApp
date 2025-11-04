import axios from "axios";
import { Bell, Book, ChevronDown, Crown, LogOut, Search, Settings, User, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { logout } from "../service/authService";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
   const [isProfileOpen, setIsProfileOpen] = useState(false);
  const {isLoggedIn ,logout:unauthenticate,user} = useAuth()
  const[isLoading ,setIsLoading] =useState(false)
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({
   name: "",
  email: "",
});




  



 useEffect(() => {
  const cookieUser = Cookies.get("user");
  console.log("cookieUser",cookieUser)
  if (cookieUser) {
    try {
      const parsedUser = JSON.parse(cookieUser);
      console.log("parseuser",parsedUser)
          setCurrentUser({
          name: `${parsedUser.name}`,
         email: parsedUser.email,

    })  
     
    } catch (e) {
      console.error("Failed to parse user from cookie:", e);
    }
  }
}, []);
 console.log("currectuser",currentUser)








const handleLogout = async() => {
    setIsLoading(true)

    try{
      await logout()
      toast.success("Logout Successfull!")
      unauthenticate()
      navigate("/login")
    }catch(error:any){
      if(axios .isAxiosError(error)){
        toast.error(error.message)
      }else{
        toast.error("somthing went wrong")
      }
    }finally{
        setIsLoading(false)
    }

  }



  return (
    <nav className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 shadow-2xl w-screen">
      <div className="w-screen mx-auto">
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-10">
          <div className="w-screen mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                  <Book className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">TASK manager</h1>
                 
                </div>
              </div>
             
            
              
              {/* Search and Actions */}
              <div className="flex items-center space-x-4">
                
                
             
               
                  {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <img
                     
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                    />
                    <div className="text-left hidden md:block">
                      <p className="text-normal font-medium text-gray-800">{}</p>
                    
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <img
                          
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-800"></p>
                            <p className="text-sm text-gray-600"></p>
                            <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                             
                            </span>
                          </div>
                        </div>
                      </div>
                      
                   
                      {/* Logout */}

                     
                      <div className="border-t border-gray-100 pt-2">
                         {isLoggedIn && (
                        <button 
                         disabled={isLoading}
                         onClick={handleLogout}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-3 text-red-600">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                         )}
                      </div>
                    </div>
                  )}
              </div>
              </div>
            </div>
          </div>
        </header>
      </div>
    </nav>
  );
};

export default Navbar;


