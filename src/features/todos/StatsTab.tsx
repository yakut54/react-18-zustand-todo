  import { useMemo } from "react"                                                                                                                                                                                                  
  import type { Todo } from "../../shared/types"                                                                                                                                                                                   
                                                                                                                                                                                                                                   
  interface Props {                                                                                                                                                                                                                
    items: Todo[]                                           
  }

  export const StatsTab = ({ items }: Props) => {
    const stats = useMemo(() => {
      const bigData = Array.from({ length: 1_000_000 }, (_, i) => i)
      bigData.filter((n) => n % 2 === 0)

      const total = items.length
      const completed = items.filter((t) => t.completed).length
      
      return {
        total,
        completed,
        active: total - completed,
        percent: total ? Math.round((completed / total) * 100) : 0,
      }
    }, [items])

    return (
      <div className="stats">
        <div className="stat-card">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Всего</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.completed}</span>
          <span className="stat-label">Выполнено</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.active}</span>
          <span className="stat-label">Активных</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.percent}%</span>
          <span className="stat-label">Прогресс</span>
        </div>
      </div>
    )
  }