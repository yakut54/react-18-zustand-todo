import { useState } from 'react'                                                                                                                                                            
  import { useAppDispatch, useAppSelector } from '../store/hooks'
  import { registerThunk } from '../features/auth/authSlice'                                                                                                                                  
  import { useNavigate, Link } from 'react-router-dom'      
  import './auth.css'

  export const RegisterPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { loading, error } = useAppSelector((state) => state.auth)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
      e.preventDefault()
      const result = await dispatch(registerThunk({ email, password }))

      if (registerThunk.fulfilled.match(result)) {
        navigate('/todos')
      }
    }

    return (
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Регистрация</h1>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
          
          <Link to="/login">Уже есть аккаунт? Войти</Link>
        </form>
      </div>
    )
  }