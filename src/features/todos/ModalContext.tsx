import { createContext, useState } from 'react'
  import type { Todo } from '../../shared/types'

  type ModalState = {
    isOpen: boolean
    todo: Todo | null
  }

  type ModalContextType = ModalState & {
    openModal: (todo: Todo) => void
    closeModal: () => void
  }

   // eslint-disable-next-line react-refresh/only-export-components
  export const ModalContext = createContext<ModalContextType | null>(null)

  export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, setState] = useState<ModalState>({ isOpen: false, todo: null })

    const openModal = (todo: Todo) => setState({ isOpen: true, todo })
    const closeModal = () => setState({ isOpen: false, todo: null })

    return (
      <ModalContext.Provider value={{ ...state, openModal, closeModal }}>
        {children}
      </ModalContext.Provider>
    )
  }

