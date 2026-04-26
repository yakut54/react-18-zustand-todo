# Todo App

> Fullstack todo-приложение с авторизацией, real-time синхронизацией и современным стеком

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat&logo=typescript)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-764ABC?style=flat&logo=redux)
![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=flat&logo=supabase)

## О проекте

Пет-проект на современном React-стеке с полноценной авторизацией через Supabase, глобальным стейтом через RTK и UI-стейтом через Zustand. Написан с упором на архитектуру и TypeScript.

## Стек

| Слой | Технология |
|---|---|
| UI | React 19 + TypeScript |
| Сборка | Vite |
| Глобальный стейт | Redux Toolkit |
| UI стейт | Zustand |
| Backend / Auth / DB | Supabase |
| Роутинг | React Router v7 |

## Фичи

- Регистрация и вход через Supabase Auth
- Восстановление сессии после перезагрузки страницы
- Защищённые роуты через ProtectedRoute
- CRUD задач с синхронизацией с PostgreSQL
- Фильтрация задач (all / active / completed) через Zustand + persist
- Поиск по задачам с useDeferredValue (React 18)
- Оптимистичные апдейты для toggle — UI обновляется мгновенно, откат при ошибке
- Skeleton loaders при загрузке задач
- Zustand devtools + useShallow для оптимизации ререндеров
- useMemo для мемоизации отфильтрованного списка
- Полная типизация TypeScript со strict mode

## Архитектура

```
src/
├── app/
│   ├── Router.tsx           # Роуты приложения
│   ├── AuthProvider.tsx     # Восстановление сессии при старте
│   └── ProtectedRoute.tsx   # Защита роутов
├── features/
│   ├── auth/
│   │   └── authSlice.ts     # Стейт авторизации + thunks (login, register, logout)
│   └── todos/
│       ├── todosSlice.ts      # Стейт задач + extraReducers
│       ├── todosThunks.ts     # CRUD thunks (fetch, add, delete, toggle)
│       └── useFilterStore.ts  # Zustand стор фильтров (persist + devtools)
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── TodosPage.tsx
│   └── CounterPage.tsx        # Zustand демо
├── shared/
│   ├── lib/
│   │   └── supabase.ts      # Supabase client
│   └── types/
│       └── index.ts         # Общие типы (Todo, User)
└── store/
    ├── index.ts             # configureStore
    └── hooks.ts             # useAppSelector, useAppDispatch
```

## Запуск локально

```bash
npm install
npm run dev
```

Создай `.env` в корне проекта:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## База данных

```sql
create table todos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  completed boolean default false,
  created_at timestamp with time zone default now()
);

create policy "Users can view own todos" on todos for select using (auth.uid() = user_id);
create policy "Users can insert own todos" on todos for insert with check (auth.uid() = user_id);
create policy "Users can update own todos" on todos for update using (auth.uid() = user_id);
create policy "Users can delete own todos" on todos for delete using (auth.uid() = user_id);

-- Права доступа                                                                                                                                                                                                        
grant usage on schema public to anon, authenticated;
grant all on table todos to anon, authenticated; 
```
