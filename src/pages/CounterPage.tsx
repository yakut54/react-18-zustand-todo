import { create } from "zustand";

// ========== ZUSTAND ==========
// Минималистичный state manager. Не требует Provider, actions, reducers.
// Альтернативы: Redux Toolkit (сложнее, больше структуры), Jotai (атомарный),
// Recoil (атомарный от Facebook), MobX (реактивный, OOP-стиль).
// Zustand выигрывает по простоте для UI-стейта (фильтры, модалки, тема).

interface CounterStore {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// create<T> — принимает дженерик типа стора.
// Возвращает хук — useCounterStore.
// Стор живёт вне React-дерева, не нужен Provider.
// ПЛЮС: можно вызывать стор даже вне компонента — useCounterStore.getState()
const useCounterStore = create<CounterStore>((set) => ({
  count: 0,

  // set((state) => ...) — когда новое значение зависит от старого.
  // Zustand делает shallow merge — не нужно спредить весь стейт как в useState.
  // ТОНКОСТЬ: set не вызывает ререндер если значение не изменилось (===)
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),

  // set(объект) — когда старый стейт не нужен
  reset: () => set({ count: 0 }),
}));

export const CounterPage = () => {
  // Компонент подписывается только на те поля которые деструктурирует.
  // ТОНКОСТЬ: если достать весь стор — const store = useCounterStore() —
  // компонент будет рендериться при любом изменении стора.
  // Для оптимизации используют shallow или селекторы:
  // const count = useCounterStore((state) => state.count)
  const count = useCounterStore((state) => state.count);
  const { increment, decrement, reset } = useCounterStore();

  // МИНУС Zustand: нет встроенного DevTools как в Redux (есть middleware, но надо подключать)
  // МИНУС: нет строгой архитектуры — легко написать спагетти в большом проекте
  // ПЛЮС: минимум бойлерплейта, быстро стартовать
  // ПЛЮС: работает вне React (в утилитах, сервисах)

  return (
    <div style={{ textAlign: "center", padding: "4rem" }}>
      <h1>Zustand Counter</h1>
      <p style={{ fontSize: "4rem", fontWeight: 700, margin: "2rem 0" }}>
        {count}
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button onClick={decrement}>−</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>+</button>
      </div>
    </div>
  );
};
