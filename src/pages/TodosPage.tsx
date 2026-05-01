import {
  useCallback,
  useRef,
  useState,
  useMemo,
  useDeferredValue,
  useTransition,
  useEffect,
} from "react";
import { useAppDispatch } from "../store/hooks";
import { addTodoThunk } from "../features/todos/todosThunks";
import { StatsTab } from "../features/todos/StatsTab";
import { useTheme } from "../shared/lib/useTheme";
import { useTodos } from "../features/todos/useTodos";
import { useUndoDelete } from "../features/todos/useUndoDelete";
import { useInlineEdit } from "../features/todos/useInlineEdit";
import { TodoItem } from "../features/todos/TodoItem";
import { useVirtualizer } from "@tanstack/react-virtual";
import "./todos.css";

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
  const {
    user,
    items,
    loading,
    error,
    filter,
    setFilter,
    handleLogout,
    toggleHandler,
  } = useTodos();

  const listRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [tab, setTab] = useState<"todos" | "stats">("todos");
  const [isPending, startTransition] = useTransition();
  const { theme, toggle } = useTheme();

  const inputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef("");

  const {
    editingId,
    editValue,
    setEditValue,
    handleEditStart,
    handleEditSave,
    handleEditCancel,
  } = useInlineEdit(items);

  const { pendingDelete, handleDelete, handleUndoDelete } = useUndoDelete();

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

  const virtualizer = useVirtualizer({
    count: filteredItems.length,
    getScrollElement: () => listRef.current,
    estimateSize: () => 57,
    overscan: 5,
  });

  const handleAdd = useCallback(() => {
    const value = (inputRef.current?.value ?? "").trim();
    if (!value) return;
    dispatch(addTodoThunk(value));
    setTitle("");
    titleRef.current = "";
    inputRef.current?.blur();
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

          <div ref={listRef} className="todo-list-scroll">
            <ul
              className="todo-list"
              style={{
                height: virtualizer.getTotalSize(),
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const todo = filteredItems[virtualItem.index];
                return (
                  <div
                    key={todo.id}
                    style={{
                      position: "absolute",
                      top: virtualItem.start,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <TodoItem
                      todo={todo}
                      editingId={editingId}
                      editValue={editValue}
                      onToggle={toggleHandler}
                      onDelete={handleDelete}
                      onEditStart={handleEditStart}
                      onEditSave={handleEditSave}
                      onEditCancel={handleEditCancel}
                      onEditChange={setEditValue}
                    />
                  </div>
                );
              })}
            </ul>
          </div>

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
