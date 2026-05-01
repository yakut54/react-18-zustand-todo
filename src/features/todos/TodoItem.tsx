import type { Todo } from '../../shared/types'

  type Props = {                                                                                                                                                          
    todo: Todo
    editingId: string | null                                                                                                                                              
    editValue: string                                       
    onToggle: (todo: Todo) => void
    onDelete: (todo: Todo) => void
    onEditStart: (todo: Todo) => void
    onEditSave: (id: string) => void
    onEditCancel: () => void
    onEditChange: (value: string) => void
  }

  export const TodoItem = ({
    todo,
    editingId,
    editValue,
    onToggle,
    onDelete,
    onEditStart,
    onEditSave,
    onEditCancel,
    onEditChange,
  }: Props) => (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />

      {editingId === todo.id ? (
        <input
          className="todo-edit-input"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onEditSave(todo.id)
            if (e.key === 'Escape') onEditCancel()
          }}
          onBlur={() => onEditSave(todo.id)}
          autoFocus
        />
      ) : (
        <span
          className={todo.completed ? 'completed' : ''}
          onDoubleClick={() => onEditStart(todo)}
        >
          {todo.title}
        </span>
      )}

      <button className="todo-delete-btn" onClick={() => onDelete(todo)}>
        ×
      </button>
    </li>
  )