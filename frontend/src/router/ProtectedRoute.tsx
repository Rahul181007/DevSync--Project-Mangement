import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hook";
import React from "react";

interface Props {
  children: React.ReactNode;
  allowedRoles?: string[];
}

// Mapping each role to its login page
const loginRoutes: Record<string, string> = {
  SUPER_ADMIN: "/superadmin/login",
  COMPANY_ADMIN: "/company/login",
  DEVELOPER: "/workspace/login",
};

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { user } = useAppSelector((state) => state.auth);

  // 1️⃣ Not logged in → redirect based on allowedRoles
  if (!user) {
    if (allowedRoles?.includes("SUPER_ADMIN")) {
      return <Navigate to="/superadmin/login" replace />;
    }
    if (allowedRoles?.includes("COMPANY_ADMIN")) {
      return <Navigate to="/company/login" replace />;
    }
    if (allowedRoles?.includes("DEVELOPER")) {
      return <Navigate to="/workspace/login" replace />;
    }

    return <Navigate to="/superadmin/login" replace />;
  }

  // 2️⃣ User is logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const redirectPath = loginRoutes[user.role] || "/superadmin/login";
    return <Navigate to={redirectPath} replace />;
  }

  // 3️⃣ Allowed → render child component
  return <>{children}</>;
};

export default ProtectedRoute;

