import { useEffect } from "react";
import { useAppDispatch } from "./app/hook";
import AppRoutes from "./router/AppRoutes";
import { checkAuthThunk } from "./modules/auth/auth.slice";

function App() {
  const dispatch=useAppDispatch();
  useEffect(()=>{
    dispatch(checkAuthThunk())
  },[dispatch]);
  
  return <AppRoutes />;
}

export default App;

