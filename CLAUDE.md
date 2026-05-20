# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Tasks

### Development and Build
- **Start Dev Server**: `npm run dev` (runs on `http://localhost:3000`)
- **Build for Production**: `npm run build`
- **Static Site Generation**: `npm run generate`
- **Preview Production Build**: `npm run preview`

## Architecture and Structure

### High-Level Architecture
The project is an interactive tutorial platform built with **Nuxt 3** and **Vue 3 (Composition API)**. It follows a modular design where the main application shell manages the state of the current active learning module.

### Project Structure
- `app.vue`: The root component and main entry point. It controls the navigation between different learning modules using a reactive state.
- `components/`: Contains the core learning modules (e.g., `ModuleArchitecture.vue`, `ModuleBackend.vue`, `ModuleComposition.vue`, etc.) and UI elements like `TutorialHeader.vue` and `ModuleNavigation.vue`.
- `server/`: Nuxt Nitro server directory.
  - `server/api/`: Contains API endpoints for server-side logic.
- `stores/`: Pinia stores (e.g., `tutorial.ts`) for managing global state across the application, such as user progress.
- `assets/css/`: Global styling and typography configuration.

### Key Technology Decisions
- **State Management**: Pinia is used for its modularity and seamless integration with Vue 3.
- **Routing/Navigation**: Instead of standard page-based routing, the application uses a dynamic module-switching approach in `app.vue` to provide a seamless "app-like" interactive experience.
- **Styling**: Uses a global CSS architecture with a focus on premium aesthetics (custom fonts, smooth animations).
- **Server Engine**: Leverages Nitro for a unified full-stack development experience.
