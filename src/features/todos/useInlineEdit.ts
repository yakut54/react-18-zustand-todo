import { useCallback, useState } from 'react'                                                                      
  import { useAppDispatch } from '../../store/hooks'                                                                 
  import { updateTodoThunk } from './todosThunks'                                                                    
  import type { Todo } from '../../shared/types'            
                                                                                                                   
  export const useInlineEdit = (items: Todo[]) => {
    const dispatch = useAppDispatch()

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editValue, setEditValue] = useState('')

    const handleEditStart = useCallback((todo: Todo) => {
      setEditingId(todo.id)
      setEditValue(todo.title)
    }, [])

    const handleEditSave = useCallback((id: string) => {
      if (editValue.trim() && editValue !== items.find((t) => t.id === id)?.title) {
        dispatch(updateTodoThunk({ id, title: editValue.trim() }))
      }
      setEditingId(null)
    }, [dispatch, editValue, items])

    const handleEditCancel = useCallback(() => {
      setEditingId(null)
    }, [])

    return { editingId, editValue, setEditValue, handleEditStart, handleEditSave, handleEditCancel }
  }