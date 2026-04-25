import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutThunk } from "../features/auth/authSlice";
import { fetchTodosThunk, addTodoThunk, deleteTodoThunk } from "../features/todos/todosThunks";
import { useNavigate } from "react-router-dom";
import "./todos.css";

export const TodosPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { items, loading, error } = useAppSelector((state) => state.todos);
  const [title, setTitle] = useState("");

  const handleAdd = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;
    dispatch(addTodoThunk(title));
    setTitle("");
  };

  useEffect(() => {
    dispatch(fetchTodosThunk());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteTodoThunk(id));
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="todos-container">
      <div className="todos-header">
        <h1>Мои задачи</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span className="todos-user">{user?.email}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      </div>

      <form className="todo-form" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Новая задача..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Добавить</button>
      </form>

      <ul className="todo-list">
        {items.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {}}
            />
            <span className={todo.completed ? "completed" : ""}>
              {todo.title}
            </span>
            <button onClick={() => handleDelete(todo.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
