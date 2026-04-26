import { createContext, useState } from 'react'

type ConfirmState = {
  isOpen: boolean
  message: string
  onConfirm: () => void
}

type ConfirmContextType = {
  isOpen: boolean
  message: string
  onConfirm: () => void
  openConfirm: (message: string, onConfirm: () => void) => void
  closeConfirm: () => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const ConfirmContext = createContext<ConfirmContextType | null>(null)

export const ConfirmProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ConfirmState>({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  })

  const openConfirm = (message: string, onConfirm: () => void) =>
    setState({ isOpen: true, message, onConfirm })

  const closeConfirm = () =>
    setState({ isOpen: false, message: '', onConfirm: () => {} })

  return (
    <ConfirmContext.Provider value={{ ...state, openConfirm, closeConfirm }}>
      {children}
    </ConfirmContext.Provider>
  )
}
