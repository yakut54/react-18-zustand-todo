# План подготовки к собесу: React 18 + RTK + Zustand + Supabase

> Цель: за 2-3 дня собрать боевой пет-проект и закрыть все типичные вопросы на собесе

---

## Проект: TODO App

**Стек:** React 18 · TypeScript · Vite · Redux Toolkit · Zustand · Supabase

**Что будет в проекте:**
- Auth через Supabase (login/register/logout)
- CRUD задач с синхронизацией с БД
- Фильтрация, сортировка, поиск
- Оптимистичные апдейты
- RTK для глобального auth-стейта
- Zustand для UI-стейта (фильтры, модалки)

---

## ДЕНЬ 1 — Фундамент ✅ ГОТОВО

### Теория — React 18 vs 17 ✅
- ✅ **Concurrent Rendering** (не "Mode") — `createRoot` включает конкурентную логику
- ✅ **`createRoot` вместо `ReactDOM.render`** — точка входа изменилась
- ✅ **Strict Mode** — монтирует компонент дважды в dev, проверяет side effects (видели в консоли!)
- ⬜ **Automatic Batching** — в React 17 батчинг только в event handlers, в 18 везде
- ⬜ **`useTransition`** — помечаем апдейт как "не срочный"
- ⬜ **`useDeferredValue`** — дефер тяжёлого вычисления (используем в поиске на Дне 3)
- ⬜ **`useId`** — генерация уникальных ID

### Практика ✅
- ✅ Создан проект `vite + react-ts`
- ✅ Структура папок: `app/`, `features/auth/`, `features/todos/`, `shared/ui/`, `shared/lib/`, `shared/types/`, `store/`
- ✅ Установлены зависимости: `@reduxjs/toolkit`, `react-redux`, `zustand`, `@supabase/supabase-js`, `react-router-dom`
- ✅ `.env` с `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`
- ✅ `src/vite-env.d.ts` — типизация env переменных (ambient declaration)
- ✅ `src/shared/lib/supabase.ts` — клиент
- ✅ `src/shared/types/index.ts` — типы `Todo`, `User`
- ✅ Supabase проект создан, таблица `todos` создана
- ✅ RLS политики: раздельные для SELECT / INSERT / UPDATE / DELETE
- ✅ Supabase подключён, проверено через консоль (`session: null`)

---

## ДЕНЬ 2 — RTK и Zustand ← СЕЙЧАС ЗДЕСЬ

### RTK (Redux Toolkit)

**Порядок:**
1. `configureStore` — создание стора
2. `createSlice` — actions + reducer в одном файле
3. `createAsyncThunk` — async операции (login/logout через Supabase)
4. `createSelector` — мемоизированные селекторы
5. TypedHooks: `useAppSelector`, `useAppDispatch`

**Практика:**
- ✅ `store/index.ts` — configureStore
- ✅ `store/hooks.ts` — typed хуки `useAppSelector`, `useAppDispatch`
- ✅ `features/auth/authSlice.ts` — стейт пользователя (actions: setUser, clearUser)
- ✅ `features/todos/todosSlice.ts` — стейт задач (actions: setTodos, addTodo, removeTodo, toggleTodo)
- ⬜ `createAsyncThunk` для login/logout
- ⬜ Подключить Provider в `main.tsx`

**Вопросы на собесе:**
- Чем `createSlice` отличается от старого Redux?
- Что такое Immer и зачем он нужен?
- Состояния `createAsyncThunk`: pending / fulfilled / rejected?
- Зачем `createSelector` и что такое мемоизация?

---

### Zustand

**Когда Zustand, когда RTK:**
- RTK → глобальный стейт (auth, серверные данные)
- Zustand → UI стейт (фильтры, модалки, тема)

**Практика:**
- ⬜ `features/todos/useTodoFilters.ts` — стор фильтров (all/active/completed)
- ⬜ `features/todos/useUIStore.ts` — модалки, лоадеры
- ⬜ Zustand с `persist` (сохранение в localStorage)
- ⬜ Zustand devtools

**Вопросы на собесе:**
- Чем Zustand отличается от Redux?
- Как работает подписка в Zustand?
- Можно ли использовать Zustand и RTK вместе? (Да!)
- Что такое `shallow` в Zustand?

---

## ДЕНЬ 3 — Собираем всё вместе

### Практика
- ⬜ Auth flow: register → login → protected routes
- ⬜ CRUD todo с Supabase
- ⬜ Оптимистичные апдейты
- ⬜ Фильтры через Zustand
- ⬜ Поиск с `useDeferredValue` (React 18!)
- ⬜ Skeleton loaders / состояния загрузки

### Вопросы на собесе — повторение

#### React
- Что такое reconciliation?
- Как работает Virtual DOM?
- Разница `useEffect` vs `useLayoutEffect`?
- Когда использовать `useCallback` и `useMemo`?
- Что такое `React.memo` и когда не поможет?
- Как работает Context и почему перерендеривает всё дерево?
- Что такое `key` и почему нельзя использовать index?

#### TypeScript
- Разница `interface` vs `type`?
- Что такое generic?
- `Partial`, `Required`, `Pick`, `Omit` — зачем?
- Что такое union и intersection типы?

#### Общее
- Что такое CSR / SSR / SSG?
- Что такое CORS?
- HTTP методы: GET / POST / PUT / PATCH / DELETE
- Что такое debounce и throttle?

---

## Supabase — что сделано

```sql
-- Таблица todos ✅
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

-- RLS политики ✅ (раздельные, не for all)
create policy "Users can view own todos" on todos for select using (auth.uid() = user_id);
create policy "Users can insert own todos" on todos for insert with check (auth.uid() = user_id);
create policy "Users can update own todos" on todos for update using (auth.uid() = user_id);
create policy "Users can delete own todos" on todos for delete using (auth.uid() = user_id);
```

---

## Ресурсы

- [React 18 release notes](https://react.dev/blog/2022/03/29/react-v18)
- [RTK официальная дока](https://redux-toolkit.js.org/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Supabase дока](https://supabase.com/docs)
