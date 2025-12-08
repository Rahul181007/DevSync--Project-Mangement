import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../../services/api/auth.api";

type AuthRole = "SUPER_ADMIN" | "COMPANY_ADMIN" | "DEVELOPER";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  companyId?: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};


export const loginThunk = createAsyncThunk<
  AuthUser, // returning ONLY user
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await authApi.login(payload);
    return res.data.data.user; // backend returns only user
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "invalid credentials"
    );
  }
});

//check auth

export const checkAuthThunk=createAsyncThunk<
AuthUser|null,
void,
{rejectValue:string}
>('auth/checkAuth',async(_,{rejectWithValue})=>{
    try {
        const res=await authApi.me();
        return res.data.data.user as AuthUser;
    } catch (error:any) {
        if(error?.response?.status===401){
            return null
        }
        return rejectWithValue(
            error?.response?.data?.message||'failed to check auth'
        )
    }
})

//logout

export const logoutThunk=createAsyncThunk(
    'auth/logout',
    async ()=>{
        await authApi.logout();
    }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // pending
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // success
      .addCase(
        loginThunk.fulfilled,
        (state, action: PayloadAction<AuthUser>) => {
          state.loading = false;
          state.user = action.payload; // store user
        }
      )

      // error
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "login failed";
      })

      // check auth (Auto login)
      .addCase(checkAuthThunk.pending,(state)=>{
        state.loading=true
      })
      .addCase(checkAuthThunk.fulfilled,
        (state,action:PayloadAction<AuthUser|null>)=>{
            state.loading=false;
            if(action.payload){
                state.user=action.payload
            }else{
                state.user=null
            }
        }
      )
      .addCase(checkAuthThunk.rejected,(state)=>{
        state.loading=false;
        state.user=null;
      })

      .addCase(logoutThunk.fulfilled,(state)=>{
        state.user=null
      })
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

