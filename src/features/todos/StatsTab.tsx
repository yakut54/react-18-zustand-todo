import type { Todo } from "../../shared/types";

interface Props {
  items: Todo[];
}

export const StatsTab = ({ items }: Props) => {
  const total = items.length
  const completed = items.filter((t) => t.completed).length
  const active = total - completed
  const percent = total ? Math.round((completed / total) * 100) : 0

  return (
    <div className="stats">
      <div className="stat-card">
        <span className="stat-value">{total}</span>
        <span className="stat-label">Всего</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{completed}</span>
        <span className="stat-label">Выполнено</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{active}</span>
        <span className="stat-label">Активных</span>
      </div>
      <div className="stat-card">
        <span className="stat-value">{percent}%</span>
        <span className="stat-label">Прогресс</span>
      </div>
    </div>
  )
}
