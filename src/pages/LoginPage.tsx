import { useState, useId } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginThunk } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import './auth.css'

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailId = useId();
  const passwordId = useId();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.fulfilled.match(result)) {
      navigate("/todos");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1>Войти</h1>
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor={passwordId}>Пароль</label>
        <input
          id={passwordId}
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>
        
        <Link to="/register">Нет аккаунта? Зарегистрироваться</Link>
      </form>
    </div>
  );
};
