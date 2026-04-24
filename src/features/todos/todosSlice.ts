import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Todo } from "../../shared/types";
import { fetchTodosThunk, addTodoThunk } from "./todosThunks";

interface TodosState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  loading: false,
  error: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload;
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodosThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodosThunk.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTodosThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Ошибка загрузки";
      });

    builder
      .addCase(addTodoThunk.pending, (state) => {
        state.error = null;
      })
      .addCase(addTodoThunk.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.items.unshift(action.payload);
      })
      .addCase(addTodoThunk.rejected, (state, action) => {
        state.error = action.payload ?? "Ошибка добавления";
      });
  },
});

export const { setTodos, addTodo, removeTodo, toggleTodo } = todosSlice.actions;
export default todosSlice.reducer;
