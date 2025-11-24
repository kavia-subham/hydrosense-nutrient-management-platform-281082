# Lightweight React Template for KAVIA

This project provides a minimal React template with a clean, modern UI and minimal dependencies.

## Features

- **Lightweight**: No heavy UI frameworks - uses only vanilla CSS and React
- **Modern UI**: Clean, responsive design with KAVIA brand styling
- **Fast**: Minimal dependencies for quick loading times
- **Simple**: Easy to understand and modify

## Getting Started

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Runs the test suite once in non-interactive mode using Jest + React Testing Library.
This is a change

### `npm run test:ci`

Runs the test suite in CI mode with coverage output.

## Testing Notes

- Tests are colocated under `src/**/__tests__` or `*.test.jsx`.
- setupTests.js configures jest-dom, requestAnimationFrame and ResizeObserver mocks.
- We use fake timers for simulator interval tests.
- Coverage thresholds are set at approximately 60% globally and can be tuned in `package.json`.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

## Customization

See `src/App.css` and `src/theme/colors.js` for brand styling tokens.

To learn React, check out the [React documentation](https://reactjs.org/).
