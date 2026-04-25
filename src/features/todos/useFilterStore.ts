  import { create } from 'zustand'                                                                                                                                                                                                            
  import { persist, devtools } from 'zustand/middleware'                                                                                                                                                                                      
                                                                                                                                                                                                                                              
  type Filter = 'all' | 'active' | 'completed'              

  interface FilterStore {
    filter: Filter
    setFilter: (filter: Filter) => void
  }

  export const useFilterStore = create<FilterStore>()(
    devtools(
      persist(
        (set) => ({
          filter: 'all',
          setFilter: (filter) => set({ filter }, false, 'setFilter')
        }),
        { name: 'todo-filter' }
      ),
      { name: 'FilterStore' }
    )
  )