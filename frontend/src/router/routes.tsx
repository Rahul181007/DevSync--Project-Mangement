import SuperAdminLoginPage from "../modules/auth/pages/SALoginPage";
import SADashboard from "../modules/superAdmin/pages/SADashboard";
import ProtectedRoute from "./ProtectedRoute";
import SALayout from "../modules/superAdmin/layouts/SALayout";
import CompaniesPage from "../modules/superAdmin/pages/CompaniesPage";
import PlanPage from "../modules/superAdmin/pages/PlanPage";
import TransactionsPage from "../modules/superAdmin/pages/TransactionsPage";
import SettingPage from "../modules/superAdmin/pages/SettingPage";
export const routes=[
    {path:'/superadmin/login',element:<SuperAdminLoginPage />},
    {path:'/superadmin',element:(
        <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
           <SALayout />
        </ProtectedRoute>
    ),
    children:[
        {path:'dashboard',element:<SADashboard />},
        {path:'companies',element:<CompaniesPage />},
        {path:'plans',element:<PlanPage />},
        {path:'transactions',element:<TransactionsPage/>},
        {path:'settings',element:<SettingPage/>}
    ]
}
]