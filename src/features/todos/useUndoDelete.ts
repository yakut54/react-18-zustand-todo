import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { deleteTodoThunk } from "./todosThunks";
import type { Todo } from "../../shared/types";

export const useUndoDelete = () => {
  const dispatch = useAppDispatch();

  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDelete = useCallback(
    (todo: Todo) => {
      setPendingDelete({ id: todo.id, title: todo.title });
      deleteTimerRef.current = setTimeout(() => {
        dispatch(deleteTodoThunk(todo.id));
        setPendingDelete(null);
      }, 5000);
    },
    [dispatch],
  );

  const handleUndoDelete = useCallback(() => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    setPendingDelete(null);
  }, []);

  return { pendingDelete, handleDelete, handleUndoDelete };
};
