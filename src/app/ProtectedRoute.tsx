  import { Navigate } from 'react-router-dom'
  import { useAppSelector } from '../store/hooks'

  interface Props {
    children: React.ReactNode
  }

  export const ProtectedRoute = ({ children }: Props) => {
    const { user } = useAppSelector((state) => state.auth)

    if (!user) return <Navigate to="/login" replace />

    return children
  }