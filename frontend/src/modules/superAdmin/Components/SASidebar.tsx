import { NavLink,useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hook";
import { logoutThunk } from "../../auth/auth.slice";

const menuItems = [
  { name: "Dashboard", path: "/superadmin/dashboard" },
  { name: "Companies", path: "/superadmin/companies" },
  { name: "Plans", path: "/superadmin/plans" },
  { name: "Transactions", path: "/superadmin/transactions" },
  { name: "Settings", path: "/superadmin/settings" },
];

export default function SASidebar(){
    const dispatch=useAppDispatch();
    const navigate=useNavigate();

    const handleLogout=async ()=>{
        await dispatch(logoutThunk())
        navigate('/superadmin/login')
    }
   
      return (
    <div className="w-64 bg-[#0A1A2F] text-white flex flex-col py-6">
      {/* Logo Section */}
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold">DevSync</h1>
        <p className="text-sm text-gray-300">Super Admin</p>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-lg ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-blue-800 hover:text-white"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 mt-6">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-red-600 hover:text-white"
        >
          Logout
        </button>
      </div>
    </div>
  );

}