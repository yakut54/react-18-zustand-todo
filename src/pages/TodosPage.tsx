import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutThunk } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import './todos.css'

export const TodosPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  return (
  <div className="todos-container">
    <div className="todos-header">
      <h1>Мои задачи</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span className="todos-user">{user?.email}</span>
        <button className="logout-btn" onClick={handleLogout}>Выйти</button>
      </div>
    </div>
  </div>
  );
};
