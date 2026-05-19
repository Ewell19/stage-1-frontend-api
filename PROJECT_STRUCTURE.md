# News Explorer - Project Structure Guide

## Directory Structure

```
src/
├── components/          # Reusable React components
│   ├── App/            # Root component with routing
│   ├── Header/         # Header component
│   ├── Navigation/     # Navigation menu
│   ├── SearchForm/     # Search bar component
│   ├── Main/           # Main page content
│   ├── NewsCard/       # Individual news article card
│   ├── About/          # About section
│   ├── Footer/         # Footer component
│   ├── Preloader/      # Loading spinner
│   ├── ModalWithForm/  # Generic modal wrapper
│   ├── LoginModal/     # Login form modal
│   └── RegisterModal/  # Registration form modal
├── pages/              # Page components
│   └── SavedNews.jsx   # Saved news page
├── utils/              # Utility functions
│   ├── api.js          # API request functions
│   └── helpers.js      # Helper functions
├── styles/             # Global and page-specific styles
├── images/             # Image assets
├── vendor/             # Third-party resources (fonts, libraries)
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Routing

- `/` - Main page with search and news feed
- `/saved-news` - Page displaying user's saved articles

## Component Architecture

All components are functional components using React Hooks. The App component manages routing using React Router v6.

### Key Components

- **App**: Root component with BrowserRouter and Route definitions
- **Navigation**: Provides navigation links to all pages
- **SearchForm**: Handles news search with form submission
- **NewsCard**: Reusable component to display individual articles
- **ModalWithForm**: Generic modal wrapper for flexible modal implementation
- **LoginModal/RegisterModal**: Authentication modals built with ModalWithForm

## Next Steps

1. Add styling to the CSS files
2. Implement API integration in `utils/api.js`
3. Add state management (Context API or Redux)
4. Connect authentication modals to backend
5. Implement news fetching and display logic
