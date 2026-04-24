import { createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../shared/lib/supabase";
import type { Todo } from "../../shared/types";

export const fetchTodosThunk = createAsyncThunk<
  Todo[],
  void,
  { rejectValue: string }
>("todos/fetch", async (_, { rejectWithValue }) => {
  const session = await supabase.auth.getSession();
  console.log("fetch todos, session:", session.data.session?.user?.email);

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return rejectWithValue(error.message);

  return data as Todo[];
});

export const addTodoThunk = createAsyncThunk<
  Todo,
  string,
  { rejectValue: string }
>("todos/add", async (title, { rejectWithValue }) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return rejectWithValue("Не авторизован");

  const { data, error } = await supabase
    .from("todos")
    .insert({ title, user_id: user.id })
    .select()
    .single();

  if (error) return rejectWithValue(error.message);

  return {                                                                                                                                                                                    
    id: data.id,                                                                                                                                                                              
    user_id: data.user_id,                                                                                                                                                                    
    title: data.title,                                      
    completed: data.completed,
    created_at: data.created_at,
  };
});
