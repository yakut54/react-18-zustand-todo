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
  // — внешние зависимости
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // — стор
  const { user } = useAppSelector((state) => state.auth);
  const { items, loading, error } = useAppSelector((state) => state.todos);
  const { filter, setFilter } = useFilterStore(
    useShallow((state) => ({
      filter: state.filter,
      setFilter: state.setFilter,
    })),
  );

  // — локальный стейт
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [tab, setTab] = useState<"todos" | "stats">("todos");
  const [isPending, startTransition] = useTransition();
  const { theme, toggle } = useTheme();

  // — ссылки
  const inputRef = useRef<HTMLInputElement>(null);

  // — производные
  const filteredItems = useMemo(() => {
    let result = items;
    if (filter === "active") result = result.filter((t) => !t.completed);
    if (filter === "completed") result = result.filter((t) => t.completed);
    if (deferredQuery.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(deferredQuery.toLowerCase()),
      );
    }
    return result;
  }, [items, filter, deferredQuery]);

  const handleAdd = useCallback(
    (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!title.trim()) return;
      dispatch(addTodoThunk(title));
      setTitle("");
    },
    [dispatch, title],
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  }, [dispatch, navigate]);

  const handleDelete = useCallback(
    async (id: string) => {
      await dispatch(deleteTodoThunk(id));
    },
    [dispatch],
  );

  const toggleHandler = useCallback(
    async (todo: Todo) => {
      await dispatch(
        toggleTodoThunk({ id: todo.id, completed: todo.completed }),
      );
    },
    [dispatch],
  );

  // — эффекты
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
            {theme === 'dark' ? '☀️' : '🌙'}
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
          <form className="todo-form" onSubmit={handleAdd}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Новая задача..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">Добавить</button>
          </form>

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
                <span className={todo.completed ? "completed" : ""}>
                  {todo.title}
                </span>
                <button
                  className="todo-delete-btn"
                  onClick={() => handleDelete(todo.id)}
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
    </div>
  );
};
