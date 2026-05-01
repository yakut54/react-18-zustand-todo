import { useEffect, useRef } from "react";
import type { Todo } from "../../shared/types";

type Props = {
  todo: Todo;
  editingId: string | null;
  editValue: string;
  onToggle: (todo: Todo) => void;
  onDelete: (todo: Todo) => void;
  onEditStart: (todo: Todo) => void;
  onEditSave: (id: string) => void;
  onEditCancel: () => void;
  onEditChange: (value: string) => void;
};

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
}: Props) => {
  const editRef = useRef<HTMLInputElement>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    if (editingId === todo.id) {
      editRef.current?.focus();
    }
  }, [editingId, todo.id]);

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo)}
      />

      {editingId === todo.id ? (
        <input
          ref={editRef}
          className="todo-edit-input"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onEditSave(todo.id);
            if (e.key === "Escape") onEditCancel();
          }}
          onBlur={() => onEditSave(todo.id)}
        />
      ) : (
        <span
          className={todo.completed ? "completed" : ""}
          onDoubleClick={() => onEditStart(todo)}
          onTouchEnd={() => {
            const now = Date.now();
            if (now - lastTap.current < 300) onEditStart(todo);
            lastTap.current = now;
          }}
        >
          {todo.title}
        </span>
      )}

      {editingId !== todo.id && (
        <button className="todo-edit-btn" onClick={() => onEditStart(todo)}>
          ✎
        </button>
      )}

      <button className="todo-delete-btn" onClick={() => onDelete(todo)}>
        ×
      </button>
    </li>
  );
};
