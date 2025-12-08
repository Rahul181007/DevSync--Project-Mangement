import SASidebar from "../Components/SASidebar";
import SATopbar from "../Components/SATopbar";
import { Outlet } from "react-router-dom";

export default function SALayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SASidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 p-6">
        
        {/* TOPBAR */}
        <SATopbar />

        {/* Dynamic page content */}
        <Outlet />
      </div>
    </div>
  );
}
