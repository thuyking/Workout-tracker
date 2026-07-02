# Repository Guidelines

## Project Structure & Module Organization

This is a personal fullstack learning project for a Workout Tracker web app. Keep frontend and backend separated clearly:

```text
frontend/
  src/
    app/
    shared/
    features/
    stores/
    styles/
backend/
  src/
    config/
    controllers/
    locales/
    middlewares/
    models/
    routes/
    services/
```

Frontend uses ReactJS with TypeScript, Vite, Ant Design, Tailwind CSS, Zustand, React Query, Axios, and React Router. Backend uses Node.js, Express.js, TypeScript, MongoDB Atlas, Mongoose, JWT Authentication, and `bcryptjs`.

## Build, Test, and Development Commands

Document exact commands once each app is initialized. Expected commands:

```bash
cd frontend && npm install
cd frontend && npm run dev
cd frontend && npm run build

cd backend && npm install
cd backend && npm run dev
```

Do not add extra libraries unless the user explicitly approves them.

## Coding Style & Naming Conventions

Write clean, readable TypeScript/React code with small modules and clear names. Use PascalCase for React components, camelCase for variables/functions, and kebab-case for folders when appropriate.

Prefer feature-focused files over large shared files. Frontend code should use the `app/shared/features` structure described below. Keep Express routes in `backend/src/routes/`, Mongoose schemas in `backend/src/models/`, request logic in controllers/services, and backend UI text in `backend/src/locales/`.

## Frontend Structure Handbook

Use this placement guide before adding or moving frontend code:

```text
frontend/src/
  app/
    App.tsx              # App boot logic such as loading locale messages
    routes.tsx           # React Router route tree
    ProtectedRoute.tsx   # Route guard and app-level routing helpers

  shared/
    api/
      axiosClient.ts     # Axios instance and interceptors
      queryClient.ts     # React Query client
    components/
      LanguageSelect.tsx # Reusable UI shared across features
    i18n/
      localeApi.ts       # Locale API calls
      localeStore.ts     # Locale Zustand store
      useTranslation.ts  # t(key) translation hook

  features/
    auth/
      api/
        authApi.ts
      pages/
        LoginPage.tsx
        RegisterPage.tsx

    workouts/
      api/
        workoutApi.ts
      components/
        AddWorkoutButton.tsx
        CopyWorkoutButton.tsx
        ViewWorkoutButton.tsx
        WorkoutModal.tsx
        WorkoutProgressPanel.tsx
      pages/
        DashboardPage.tsx
        WorkoutHistoryPage.tsx
      stores/
        workoutUiStore.ts

    plans/
      api/
        workoutPlanApi.ts
      components/
        WorkoutPlanCard.tsx
        WorkoutPlanExerciseChecklist.tsx
        WorkoutPlanForm.tsx
      pages/
        TodayPlanPage.tsx
        WorkoutPlansPage.tsx

  stores/
    authStore.ts         # Cross-app auth state
    appStore.ts          # Cross-app state only; avoid feature state here
```

Rules for new frontend files:
- Put feature-specific API, pages, components, and Zustand stores inside `frontend/src/features/<feature>/`.
- Put reusable components, API clients, i18n helpers, and provider-level utilities inside `frontend/src/shared/`.
- Put route definitions and app shell code inside `frontend/src/app/`.
- Keep `frontend/src/stores/` only for cross-app state. Do not add feature state there.
- Do not recreate legacy folders like `frontend/src/api`, `frontend/src/pages`, `frontend/src/routes`, `frontend/src/components`, or `frontend/src/hooks`.
- Frontend UI text should use `useTranslation().t('key.path')`; add the actual English/Vietnamese text in `backend/src/locales/en.ts` and `backend/src/locales/vi.ts`.
- Do not add new dependencies or path aliases unless the user explicitly approves them.

## Testing Guidelines

Testing tools are not configured yet. When tests are added, keep them close to the feature or in a clear `tests/` folder. Use descriptive test names that explain behavior, such as `creates workout with valid data`.

Run the available test command before finishing any change once test tooling exists.

## Commit & Pull Request Guidelines

There is no Git history yet, so use concise imperative commits such as `Add workout routes` or `Create login page`. Keep each commit focused on one small step.

Pull requests should include a short description, what changed, how it was tested, and screenshots for UI changes.

## Agent-Specific Instructions

Work in small steps. Do not generate too much code at once. When creating a new file, briefly explain why it is needed. Prefer simple implementations that match the requested stack. Do not introduce new dependencies, architecture patterns, or tooling without explicit approval.

## Security & Configuration Tips

Never commit secrets, MongoDB Atlas credentials, JWT secrets, or local environment files. Use `.env` locally and provide `.env.example` when configuration becomes necessary.
