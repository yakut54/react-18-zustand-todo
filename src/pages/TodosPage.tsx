import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  useDeferredValue,
  useTransition,
} from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutThunk } from "../features/auth/authSlice";
import {
  fetchTodosThunk,
  addTodoThunk,
  deleteTodoThunk,
  toggleTodoThunk,
  updateTodoThunk,
} from "../features/todos/todosThunks";
import { useNavigate } from "react-router-dom";
import { useFilterStore } from "../features/todos/useFilterStore";
import { useShallow } from "zustand/react/shallow";
import type { Todo } from "../shared/types";
import "./todos.css";
import { StatsTab } from "../features/todos/StatsTab";
import { useTheme } from "../shared/lib/useTheme";

const SkeletonList = () => (
  <ul className="todo-list">
    {Array.from({ length: 4 }).map((_, i) => (
      <li key={i} className="skeleton-item">
        <div className="skeleton-box" style={{ width: 18, height: 18 }} />
        <div className="skeleton-box" style={{ flex: 1, height: 16 }} />
        <div className="skeleton-box" style={{ width: 20, height: 20 }} />
      </li>
    ))}
  </ul>
);

export const TodosPage = () => {
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

  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [tab, setTab] = useState<"todos" | "stats">("todos");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPending, startTransition] = useTransition();
  const { theme, toggle } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef("");

  const filteredItems = useMemo(() => {
    let result = items;
    if (filter === "active") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);
    if (deferredQuery.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(deferredQuery.toLowerCase()),
      );
    }
    if (pendingDelete) result = result.filter((t) => t.id !== pendingDelete.id);
    return result;
  }, [items, filter, deferredQuery, pendingDelete]);

  const handleAdd = useCallback(() => {
    const value = (inputRef.current?.value ?? "").trim();
    if (!value) return;
    dispatch(addTodoThunk(value));
    setTitle("");
    titleRef.current = "";
    inputRef.current?.blur();
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  }, [dispatch, navigate]);

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

  const toggleHandler = useCallback(
    async (todo: Todo) => {
      await dispatch(
        toggleTodoThunk({ id: todo.id, completed: todo.completed }),
      );
    },
    [dispatch],
  );

  const handleEditStart = useCallback((todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.title);
  }, []);

  const handleEditSave = useCallback(
    (id: string) => {
      if (
        editValue.trim() &&
        editValue !== items.find((t) => t.id === id)?.title
      ) {
        dispatch(updateTodoThunk({ id, title: editValue.trim() }));
      }
      setEditingId(null);
    },
    [dispatch, editValue, items],
  );

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
  }, []);

  useEffect(() => {
    dispatch(fetchTodosThunk());
  }, [dispatch]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  if (loading)
    return (
      <div className="todos-container">
        <SkeletonList />
      </div>
    );

  if (error) return <div>{error}</div>;

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h1>Мои задачи</h1>
        <div className="todos-header-right">
          <span className="todos-user">{user?.email}</span>
          <button className="theme-toggle-btn" onClick={toggle}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>

      <div className="todo-tabs">
        <button
          className={tab === "todos" ? "active" : ""}
          onClick={() => setTab("todos")}
        >
          Задачи
        </button>
        <button
          className={tab === "stats" ? "active" : ""}
          onClick={() => setTab("stats")}
        >
          Статистика
        </button>
      </div>

      {tab === "todos" ? (
        <>
          <div className="todo-form">
            <input
              ref={inputRef}
              type="text"
              placeholder="Новая задача..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                titleRef.current = e.target.value;
              }}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <button type="button" onClick={handleAdd}>
              Добавить
            </button>
          </div>

          <input
            className="todo-search"
            type="text"
            placeholder={isPending ? "Фильтрация..." : "Поиск..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="todo-filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => startTransition(() => setFilter("all"))}
            >
              Все
            </button>
            <button
              className={filter === "active" ? "active" : ""}
              onClick={() => startTransition(() => setFilter("active"))}
            >
              Активные
            </button>
            <button
              className={filter === "completed" ? "active" : ""}
              onClick={() => startTransition(() => setFilter("completed"))}
            >
              Выполненные
            </button>
          </div>

          <ul className="todo-list">
            {filteredItems.map((todo) => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleHandler(todo)}
                />

                {editingId === todo.id ? (
                  <input
                    className="todo-edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(todo.id);
                      if (e.key === "Escape") handleEditCancel();
                    }}
                    onBlur={() => handleEditSave(todo.id)}
                    autoFocus
                  />
                ) : (
                  <span
                    className={todo.completed ? "completed" : ""}
                    onDoubleClick={() => handleEditStart(todo)}
                  >
                    {todo.title}
                  </span>
                )}

                <button
                  className="todo-delete-btn"
                  onClick={() => handleDelete(todo)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          {filteredItems.length === 0 && (
            <p className="todos-empty">Задач нет. Добавь первую!</p>
          )}
        </>
      ) : (
        <StatsTab items={items} />
      )}

      {pendingDelete && (
        <div className="undo-toast">
          <span>Удалено: «{pendingDelete.title}»</span>
          <button onClick={handleUndoDelete}>Отменить</button>
        </div>
      )}
    </div>
  );
};
