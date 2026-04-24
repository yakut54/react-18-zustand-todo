import { useEffect } from 'react'
  import { useAppDispatch, useAppSelector } from '../store/hooks'
  import { initAuthThunk } from '../features/auth/authSlice'

  interface Props {
    children: React.ReactNode
  }

  export const AuthProvider = ({ children }: Props) => {
    const dispatch = useAppDispatch()
    const { initialized } = useAppSelector((state) => state.auth)

    useEffect(() => {
      dispatch(initAuthThunk())
    }, [dispatch])

    if (!initialized) return <div>Загрузка...</div>

    return children
  }