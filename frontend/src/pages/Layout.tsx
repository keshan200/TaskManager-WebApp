import { Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../context/useAuth";
import Loading from "../components/LoadingAnime";
import Navbar from "../components/Navbar";


const Layout = () => {
 const {isAuthenticating,isLoggedIn} = useAuth()




 if(isAuthenticating){
  return <Loading />
  }


  const hideNavbar = location.pathname === "/" || location.pathname === "/login";


  return (
    <div className="h-screen overflow-hidden">
     
       {!hideNavbar && isLoggedIn &&(
        <div>
          <Navbar />
        </div>
      )}
      

      <main className="h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
