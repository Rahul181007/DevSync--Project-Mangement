import { useEffect } from "react";
import { useAppDispatch } from "./app/hook";
import AppRoutes from "./router/AppRoutes";
import { checkAuthThunk } from "./modules/auth/auth.slice";

function App() {
  const dispatch=useAppDispatch();
  useEffect(()=>{
    const path = window.location.pathname;

  // Don't run checkAuth on login pages
  if (path !== "/superadmin/login" && path !== "/company/login") {
    dispatch(checkAuthThunk())
  }
  },[dispatch]);

  return <AppRoutes />;
}

export default App;

