import { useLocation } from "react-router-dom";
import { Bell, User } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/superadmin/dashboard": "Dashboard",
  "/superadmin/companies": "Company Management",
  "/superadmin/plans": "Subscription Plans",
  "/superadmin/transactions": "Transactions",
  "/superadmin/settings": "Settings",
};

export default function SATopbar() {
  const location = useLocation();

  // Determine title from URL
  const title = pageTitles[location.pathname] || "DevSync";

  return (
    <div className="flex items-center justify-between bg-white shadow px-6 py-4 rounded-lg mb-6">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>

      {/* Right Icons */}
      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6 text-gray-600" />
        </button>

        {/* User Avatar */}
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-medium">
          <User className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
