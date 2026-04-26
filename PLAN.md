# План подготовки к собесу: React 19 + RTK + Zustand + Supabase

> Цель: за 2-3 дня собрать боевой пет-проект и закрыть все типичные вопросы на собесе

---

## Проект: TODO App

**Стек:** React 19 · TypeScript · Vite · Redux Toolkit · Zustand · Supabase · React Router v7

**Что будет в проекте:**
- Auth через Supabase (login/register/logout)
- CRUD задач с синхронизацией с БД
- Фильтрация, сортировка, поиск
- Оптимистичные апдейты
- RTK для глобального auth-стейта и todos
- Zustand для UI-стейта (фильтры)

---

## ДЕНЬ 1 — Фундамент ✅ ГОТОВО

### Теория — React 18 vs 17 ✅
- ✅ **Concurrent Rendering** (не "Mode") — `createRoot` включает конкурентную логику
- ✅ **`createRoot` вместо `ReactDOM.render`** — точка входа изменилась
- ✅ **Strict Mode** — монтирует компонент дважды в dev, проверяет side effects
- ⬜ **Automatic Batching** — в React 17 батчинг только в event handlers, в 18 везде
- ⬜ **`useTransition`** — помечаем апдейт как "не срочный"
- ✅ **`useDeferredValue`** — дефер тяжёлого вычисления (используем в поиске на Дне 3)
- ⬜ **`useId`** — генерация уникальных ID

### Практика ✅
- ✅ Создан проект `vite + react-ts`
- ✅ Структура папок: `app/`, `features/auth/`, `features/todos/`, `shared/lib/`, `shared/types/`, `store/`, `pages/`
- ✅ Установлены зависимости: `@reduxjs/toolkit`, `react-redux`, `zustand`, `@supabase/supabase-js`, `react-router-dom`
- ✅ `.env` с `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`
- ✅ `src/vite-env.d.ts` — типизация env переменных (ambient declaration)
- ✅ `src/shared/lib/supabase.ts` — клиент
- ✅ `src/shared/types/index.ts` — типы `Todo`, `User`
- ✅ Supabase проект создан, таблица `todos` создана
- ✅ RLS политики: раздельные для SELECT / INSERT / UPDATE / DELETE
- ✅ Supabase подключён, проверено через консоль

---

## ДЕНЬ 2 — RTK, Auth, Роутинг ✅ ГОТОВО

### RTK (Redux Toolkit) ✅
- ✅ `store/index.ts` — configureStore с подключёнными редьюсерами
- ✅ `store/hooks.ts` — typed хуки `useAppSelector`, `useAppDispatch`
- ✅ `features/auth/authSlice.ts` — стейт пользователя + все thunks
- ✅ `features/todos/todosSlice.ts` — стейт задач с типизацией `PayloadAction<T>`
- ✅ `createAsyncThunk` для login / register / logout / initAuth
- ✅ `extraReducers` — pending / fulfilled / rejected для всех thunks
- ✅ `initialized` флаг — восстановление сессии при перезагрузке страницы
- ✅ Provider подключён в `main.tsx`

### Роутинг ✅
- ✅ `app/Router.tsx` — React Router v7, маршруты /login, /register, /todos
- ✅ `app/AuthProvider.tsx` — восстановление сессии Supabase при старте
- ✅ `app/ProtectedRoute.tsx` — защита роутов, редирект на /login если не залогинен

### Auth UI ✅
- ✅ `pages/LoginPage.tsx` — форма входа, controlled inputs, обработка ошибок
- ✅ `pages/RegisterPage.tsx` — форма регистрации, после регистрации сразу логиним
- ✅ `pages/TodosPage.tsx` — заготовка, кнопка logout, отображение email
- ✅ CSS для auth форм (auth.css) и todos страницы (todos.css)
- ✅ Шрифт Inter через Google Fonts

**Вопросы на собесе:**
- Чем `createSlice` отличается от старого Redux?
- Что такое Immer и зачем он нужен?
- Состояния `createAsyncThunk`: pending / fulfilled / rejected?
- Зачем `createSelector` и что такое мемоизация?
- Что такое `PayloadAction<T>` и зачем типизировать payload?
- Чем `rejectWithValue` отличается от `throw`?
- Зачем `ProtectedRoute` и как он работает?
- Зачем `initialized` флаг отдельно от `loading`?

---

## ДЕНЬ 3 — CRUD и Zustand ✅ ГОТОВО

### CRUD задач с Supabase ✅
- ✅ `features/todos/todosThunks.ts` — отдельный файл для async операций
- ✅ `fetchTodosThunk` — загрузка задач из Supabase при входе на TodosPage
- ✅ `addTodoThunk` — добавление задачи с явным маппингом типов
- ✅ `deleteTodoThunk` — удаление задачи
- ✅ `toggleTodoThunk` — переключение completed через Supabase
- ✅ Форма добавления задачи с controlled input
- ✅ Список задач с CSS стилями (hover, transitions, empty state)

### Zustand ✅
- ✅ `features/todos/useFilterStore.ts` — стор фильтров (all/active/completed)
- ✅ `persist` middleware — сохранение фильтра в localStorage
- ✅ `devtools` middleware — интеграция с Redux DevTools
- ✅ `useShallow` — оптимизация подписки, shallow сравнение
- ✅ Фильтрация через `useMemo` на клиенте
- ✅ `pages/CounterPage.tsx` — демо Zustand с комментариями для собеса

### React хуки — покрываем в процессе
- ✅ `useState` — формы логина/регистрации, инпут добавления задачи
- ✅ `useEffect` — initAuth при старте, загрузка задач
- ✅ `useMemo` — мемоизация отфильтрованного списка задач
- ✅ `useCallback` — стабилизация обработчиков в списке задач
- ✅ `useRef` — фокус на инпут при добавлении задачи
- ⬜ `useId` — id для label/input в формах (accessibility)
- ✅ `useDeferredValue` — поиск по задачам без лагов (React 18+)
- ⬜ `useTransition` — пометить фильтрацию как некритичный апдейт

### Теория разобрана в чате
- ✅ `useEffect` — зависимости, cleanup, сравнение с useLayoutEffect
- ✅ Zustand селекторы — примитивы vs useShallow, антипаттерн подписки на весь стор

### Осталось ← СЕЙЧАС ЗДЕСЬ
- ✅ `useCallback` — оптимизация обработчиков в TodosPage
- ✅ `useRef` — фокус на инпут
- ✅ `useDeferredValue` — поиск по задачам без лагов
- ✅ Оптимистичные апдейты — toggle мгновенный, откат при ошибке
- ✅ Skeleton loaders

---

## БОНУС — RTK Query

> Следующий уровень над `createAsyncThunk`. Знать после того как основа отработана.

**Что это:** RTK Query автоматически генерирует хуки для запросов, кэширует данные, управляет loading/error сам — без `extraReducers` и `pending/fulfilled/rejected` вручную.

**Сравнение:**
```ts
// createAsyncThunk — пишешь сам
const fetchTodosThunk = createAsyncThunk('todos/fetch', async () => { ... })
// + extraReducers в слайсе
// + dispatch в компоненте
// + items/loading/error из useAppSelector

// RTK Query — генерируется автоматически
const { data, isLoading, error } = useGetTodosQuery()
```

**Практика:**
- ⬜ `store/api.ts` — `createApi` с baseQuery для Supabase
- ⬜ Эндпоинты: `getTodos`, `addTodo`, `deleteTodo`, `toggleTodo`
- ⬜ Подключить в `store/index.ts`
- ⬜ Использовать хуки в `TodosPage`

**Вопросы на собесе:**
- Чем RTK Query отличается от `createAsyncThunk`?
- Что такое кэш в RTK Query и как он инвалидируется?
- Что такое `tags` и `providesTags` / `invalidatesTags`?
- Когда использовать RTK Query, а когда `createAsyncThunk`?

---

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
- Что такое type narrowing?
- Чем `as` опасен?

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

-- Права доступа ✅
grant usage on schema public to anon, authenticated;
grant all on table todos to anon, authenticated;
```

---

## Ресурсы

- [React 18 release notes](https://react.dev/blog/2022/03/29/react-v18)
- [RTK официальная дока](https://redux-toolkit.js.org/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [Supabase дока](https://supabase.com/docs)
