import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hook';
import SuperAdminLoginForm from '../components/LoginForm'
import { useEffect } from 'react';

const SuperAdminLoginPage = () => {
    const {user}=useAppSelector((state)=>state.auth)
    const navigate=useNavigate();

    useEffect(()=>{
        if(user?.role==='SUPER_ADMIN'){
            navigate('/superadmin/dashboard')
        }
    },[user,navigate])
  return (
    <div className="min-h-screen flex">
      {/* LEFT SECTION */}
      <div className="hidden md:flex flex-col justify-center bg-gray-50 w-1/2 p-16">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to the DevSync
          <br />
          Control Center
        </h1>

        <p className="text-gray-600 mt-4 max-w-md">
          Manage tenants, monitor system health, and access advanced analytics all in one place.
        </p>

        <div className="mt-10 space-y-6 max-w-sm">
          <div className="p-4 bg-white shadow rounded-xl border">
            <p className="font-semibold">Centralized Tenant Management</p>
            <p className="text-gray-500 text-sm">
              Oversee all customer accounts from a single dashboard.
            </p>
          </div>

          <div className="p-4 bg-white shadow rounded-xl border">
            <p className="font-semibold">Advanced System Analytics</p>
            <p className="text-gray-500 text-sm">
              Gain insights into platform performance and usage.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION (LOGIN FORM) */}
      <div className="flex justify-center items-center w-full md:w-1/2 p-10">
        <div className="w-full max-w-md">
          <SuperAdminLoginForm />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;