import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hook";
import { loginThunk } from "../auth.slice";

const LoginForm=()=>{
    const dispatch=useAppDispatch();

    const {loading,error}=useAppSelector((state)=>state.auth)

    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit=(e:React.FormEvent)=>{
        e.preventDefault();
        dispatch(loginThunk({email,password}))
    }
    return (
    <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Email
        </label>
        <input
          type="email"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Password
        </label>
        <input
          type="password"
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-2 rounded">
          {error}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm