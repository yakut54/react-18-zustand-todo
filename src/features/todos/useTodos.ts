import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useFilterStore } from "./useFilterStore";
import { useShallow } from "zustand/shallow";
import { useCallback, useEffect } from "react";
import { logoutThunk } from "../auth/authSlice";
import type { Todo } from "../../shared/types";
import { fetchTodosThunk, toggleTodoThunk } from "./todosThunks";

export const useTodos = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { items, loading, error } = useAppSelector((state) => state.todos);
  const { filter, setFilter } = useFilterStore(
    useShallow((state) => ({
      filter: state.filter,
      setFilter: state.setFilter,
    })),
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  }, [dispatch, navigate]);

  const toggleHandler = useCallback(
    async (todo: Todo) => {
      await dispatch(
        toggleTodoThunk({ id: todo.id, completed: todo.completed }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchTodosThunk());
  }, [dispatch]);

  return {
    user,
    items,
    loading,
    error,
    filter,
    setFilter,
    handleLogout,
    toggleHandler,
  };
};
