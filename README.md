# News Explorer (Frontend)

React + Vite frontend for the News Explorer project.

## Live Demo

- Frontend (GitHub Pages): ADD_YOUR_GITHUB_PAGES_URL_HERE
- Pull Request: ADD_YOUR_PR_URL_HERE

## Tech Stack

- React 18
- React Router DOM 6
- Vite 5
- Vanilla CSS (BEM-style class naming)

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run preview` - preview production build locally

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open the local URL shown in terminal (usually `http://localhost:3000` or next available port).

## Project Structure

- `src/components` - UI components and CSS modules
- `src/pages` - route-level pages (`SavedNews`)
- `src/utils` - API and local saved-articles helpers
- `src/images` - images and SVG icons
- `src/fonts` - font assets folder

## Implemented Features

- Responsive layout for desktop/tablet/mobile (including 320px)
- News search flow with loading, error, and empty states
- Saved articles page and card deletion
- Route-level protection for `/saved-news`
  - Unauthorized users are redirected to `/`
  - Sign-in modal opens automatically after redirect
- Auth modal flows (sign in/sign up) with client-side validation
- User session persistence in localStorage
- Mobile modal keyboard support improvements (iOS/Android)

## Routes

- `/` - home page (public)
- `/saved-news` - protected page (requires signed-in user)

## Notes

- News requests use NewsAPI (`src/utils/api.js`).
- Current auth and saved article persistence are localStorage-based in this frontend project.

## Deployment (GitHub Pages)

1. Ensure `npm run build` succeeds.
2. Deploy the `dist` output to GitHub Pages.
3. Add the final production URL above in the Live Demo section.
