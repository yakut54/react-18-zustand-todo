import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../shared/lib/supabase";
import type { User } from "../../shared/types";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

//============= loginThunk ============

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginThunk = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return rejectWithValue(error.message);
  if (!data.user.email) return rejectWithValue("Email не найден");
  return { id: data.user.id, email: data.user.email };
});

//============= registerThunk ============

interface RegisterCredentials {
  email: string;
  password: string;
}

export const registerThunk = createAsyncThunk<
  User,
  RegisterCredentials,
  { rejectValue: string }
>("auth/register", async ({ email, password }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return rejectWithValue(error.message);
  if (!data.user?.email) return rejectWithValue("Ошибка регистрации");
  return { id: data.user.id, email: data.user.email };
});

//============ initAuthThunk =============

export const initAuthThunk = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>("auth/init", async (_, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.getSession();

  if (error) return rejectWithValue(error.message);

  const user = data.session?.user;

  if (!user?.email) return null;
  return { id: user.id, email: user.email };
});

//============= logoutThunk ============

export const logoutThunk = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    await supabase.auth.signOut();
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    //============ loginThunk =============

    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка входа";
      });

    //============ registerThunk =============

    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка регистрации";
      });

    //============ initAuthThunk =============

    builder
      .addCase(initAuthThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(initAuthThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(initAuthThunk.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.initialized = true;
      });

    //============ logoutThunk =============

    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.user = null;
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
