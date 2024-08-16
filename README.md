# Quik-Auction Project

Welcome to the **Quik-Auction** project! This repository contains a web application for buying and selling used cars. The application is built using React and TypeScript, with various additional dependencies for development and testing purposes.

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following tools installed on your system:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher)

### Installation

1. Clone this repository to your local machine using your preferred method (HTTPS or SSH):

   ```bash
   git clone https://github.com/M-Ahmad-Asghar/cash-for-cars
   ```

2. Change into the project directory:

   ```bash
   cd cash-for-cars
   ```

3. Install project dependencies:

   ```bash
   npm install
   ```

### Available Scripts

In the project directory, you can run the following scripts:

- **Start Development Server:**

  ```bash
  npm run dev
  ```

  This will start the Vite development server, which will build the project and open it in your default web browser. The development server also enables hot module replacement, so any changes you make to the code will be automatically reflected in the browser.

- **Build Production Version:**

  ```bash
  npm run build
  ```

  This script will build the production version of the project using TypeScript and Vite. The output will be placed in the `dist` folder.

- **Run Tests:**

  ```bash
  npm test
  ```

  This script runs the test suite using Jest. Tests can be found in the `src` folder, and filenames with the `.test.ts` extension are considered test files.

- **Linting:**

  ```bash
  npm run lint
  ```

  This script runs ESLint to check for linting issues in the project's JavaScript, TypeScript, JSX, JSON, and CSS files.

- **Fix Linting Issues:**

  ```bash
  npm run lint:fix
  ```

  This script runs ESLint with the `--fix` option to automatically fix some linting issues.

- **Format Code:**

  ```bash
  npm run format
  ```

  This script formats the code using Prettier and updates the files with the formatted code.

- **Preview Production Build:**

  ```bash
  npm run preview
  ```

  This script serves the production build of the project locally, allowing you to preview it before deployment.

### Dependencies

The project has the following major dependencies:

- **React**: JavaScript library for building user interfaces.
- **TypeScript**: Adds static typing to JavaScript.
- **Vite**: Fast and lightweight build tool and development server.
- **i18next**: Internationalization (i18n) library for translations.
- **react-i18next**: Integration of i18next with React components.
- **react-router-dom**: DOM bindings for React Router.
- **@babel/preset-env**, **@babel/preset-react**: Babel presets for modern JavaScript and React.
- **@testing-library/react**, **@testing-library/jest-dom**, **@testing-library/user-event**: Testing utilities for React components.
- **jest**, **ts-jest**: Testing framework for JavaScript and TypeScript.
- **eslint**, **prettier**: Code linting and formatting tools.

Please refer to the `package.json` file for the complete list of dependencies.

### Contributing

We welcome contributions to improve the project.

Happy coding! 🚀
