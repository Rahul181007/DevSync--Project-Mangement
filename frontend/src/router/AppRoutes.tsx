import { Routes, Route } from "react-router-dom";
import { routes } from "./routes";

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route 
          key={route.path} 
          path={route.path} 
          element={route.element}
        >
          {/* CHILD ROUTES */}
          {route.children &&
            route.children.map((child) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
        </Route>
      ))}
    </Routes>
  );
};

export default AppRoutes;
