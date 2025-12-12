# Angular Project Manager - Copilot Instructions

## Architecture Overview

This is an Angular 19+ project using standalone components and Server-Side Rendering (SSR). The app follows a feature-driven architecture:

- **Features**: Organized under `src/app/features/` (currently: `projects`)
- **Components**: Feature components live in `features/{feature}/components/`
- **Core**: Empty directory reserved for shared services and guards
- **Utils**: Reserved for shared utilities and helpers

## Key Patterns & Conventions

### Component Structure
- **Standalone Components**: All components use Angular 19's standalone component pattern
- **Component Selector**: Components use `app-` prefix (configured in `angular.json`)
- **Template Syntax**: Uses Angular 17+ control flow syntax (`@for`, `@if`, `@empty`)

Example from `task-list.component.html`:
```html
@for (let task of tasks; track task.title) {
  <div>{{ task.title }}</div>
} @empty {
  <p>Aucune tâche.</p>
}
```

### Styling & UI
- **Tailwind CSS**: Primary styling framework (imported in `src/styles.css`)
- **Dynamic Classes**: Use `[ngClass]` for conditional Tailwind classes
- **Status Colors**: Consistent color mapping for task/project statuses:
  - `En attente` → `border-yellow-400`
  - `En cours` → `border-blue-400`  
  - `Terminé` → `border-green-400`

### Data Flow
- **Parent-Child Communication**: Use `@Input()` decorators for data passing
- **Mock Data**: Components contain hardcoded sample data (no services yet)
- **French Labels**: UI text is in French ("Projet", "Tâche", "En cours", etc.)

## Development Workflow

### Key Commands
```bash
npm start          # Development server (ng serve)
npm run build      # Production build
npm test           # Run tests with Karma
npm run watch      # Build in watch mode
```

### SSR Support
- Server entry: `src/main.server.ts`
- Express server: `src/server.ts`  
- SSR serve: `npm run serve:ssr:project-manager`

## File Naming & Structure

- **Components**: `{name}.component.{ts|html|css|spec.ts}`
- **Styles**: Use `.scss` extension in component metadata but files are `.css`
- **Features**: Group related components under `features/{domain}/components/`

## Current Implementation Notes

- No routing configured yet (`app.routes.ts` is empty)
- No shared services or state management
- Components are not yet imported/declared in any module
- Tailwind config is minimal (empty content array needs updating)
- Mock data structure: Projects contain arrays of tasks with `title`, `priority`, `status`

## When Adding New Features

1. Create feature directory under `src/app/features/`
2. Use Angular CLI: `ng generate component features/{feature}/components/{name}`
3. Follow standalone component pattern
4. Apply consistent Tailwind styling patterns
5. Use Angular 17+ control flow syntax in templates
6. Consider French localization for user-facing text