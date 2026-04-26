import { useState } from 'react'
import { useModal } from './useModal'
import { useAppDispatch } from '../../store/hooks'
import { updateTodoThunk } from './todosThunks'

export const EditModal = () => {
  const { isOpen, todo, closeModal } = useModal()
  const [value, setValue] = useState(todo?.title ?? '')
  const dispatch = useAppDispatch()

  if (!isOpen || !todo) return null

  const handleSave = () => {
    if (value.trim() && value !== todo.title) {
      dispatch(updateTodoThunk({ id: todo.id, title: value.trim() }))
    }
    closeModal()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') closeModal()
  }

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Редактировать</h2>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="modal-actions">
          <button className="modal-cancel" onClick={closeModal}>Отмена</button>
          <button className="modal-save" onClick={handleSave}>Сохранить</button>
        </div>
      </div>
    </div>
  )
}
