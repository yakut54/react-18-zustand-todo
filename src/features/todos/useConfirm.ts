import { useContext } from 'react'
import { ConfirmContext } from './ConfirmContext'

export const useConfirm = () => {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within ConfirmProvider')
  return ctx
}
