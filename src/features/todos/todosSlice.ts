import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Todo } from '../../shared/types'

interface TodosState {
  items: Todo[]
  loading: boolean
  error: string | null
}

const initialState: TodosState = {
  items: [],
  loading: false,
  error: null,
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<Todo[]>) => {
      state.items = action.payload
    },
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.items.push(action.payload)
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload)
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find((t) => t.id === action.payload)
      if (todo) todo.completed = !todo.completed
    },
  },
})

export const { setTodos, addTodo, removeTodo, toggleTodo } = todosSlice.actions
export default todosSlice.reducer
