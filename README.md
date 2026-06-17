# CTD Todo List

A full-stack task management app built with React. Supports creating, editing, completing, and deleting tasks with priority levels, real-time filtering and search, and a stats profile view — all backed by a hosted REST API with cookie-based authentication.

---

## Features

- **Authentication** — login/logout with session cookies and CSRF token protection
- **Full CRUD** — create, read, update, and delete tasks
- **Priority levels** — assign high, medium, or low priority to each task; visual indicators throughout
- **Filtering** — filter tasks by status (All / Active / Completed) and priority
- **Search** — client-side full-text search with instant results and no loading flash
- **Sorting** — sort by date created or title, ascending or descending
- **Profile & stats** — task completion rate, counts by status, progress breakdown by priority
- **Empty states** — context-aware messaging for first use, all-caught-up, filtered results, and more
- **Error handling** — auto-dismissing error banners for all API failures
- **Responsive design** — sidebar layout on desktop, compact tab strip on mobile
- **Input sanitization** — all user input validated and sanitized with DOMPurify before submission
- **404 page** — styled not-found page for unmatched routes

---

## Technologies Used

| Category | Technology |
|---|---|
| Framework | React 19 |
| Routing | React Router v7 |
| Build tool | Vite |
| Styling | CSS Modules (vanilla CSS) |
| Icons | lucide-react |
| Sanitization | DOMPurify |
| Linting | ESLint with react-hooks plugin |
| Backend API | Hosted Node.js REST API (DigitalOcean) |

---

## Screenshots
<img width="955" height="768" alt="image" src="https://github.com/user-attachments/assets/4d9d07d7-2d28-4487-9ff6-fb0ddadb94be" />

---
<img width="955" height="768" alt="image" src="https://github.com/user-attachments/assets/cb5a1990-6701-4473-a48d-5f4ea8b38c21" />

---
<img width="1101" height="432" alt="image" src="https://github.com/user-attachments/assets/ca76f3a7-7b18-43e7-9b3c-79aed64c834e" />

## Live Demo Video
https://drive.google.com/file/d/11YsSXadrr6SO65u-YHNASSCufbgT-GnG/view?usp=share_link


## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dashi-ki/ctd-todo-list.git
   cd ctd-todo-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```
   VITE_TARGET=https://ctd-learns-node-l42tx.ondigitalocean.app
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the local development server with HMR |
| `npm run build` | Build the app for production into `dist/` |
| `npm run preview` | Serve the production build locally for testing |
| `npm run lint` | Run ESLint across all source files |

---

## Design Decisions

**CSS Modules with vanilla CSS** was chosen over Tailwind or styled-components to keep the styling explicit and portable — every component owns its own `.module.css` file with no runtime overhead. Design tokens (colors, spacing, border radius) live in CSS custom properties on `:root`, making the theme easy to change in one place.

**URL as UI state** — sort order, status filter, and priority filter are stored as URL search params rather than React state. This means filter state survives a page refresh, is shareable via link, and requires no prop drilling or context between the sidebar and the todo list.

**Client-side sort and filter** — all filtering, searching, and sorting happen in a `useMemo` on the full task list fetched once on login. This eliminates loading flashes when changing filters and reduces API calls to one per session.

**`useReducer` for task state** — the todo list uses a reducer pattern to keep all state transitions explicit and in one place, making the data flow easy to follow and extend.

---

## Future Improvements

- **Due dates** — the API supports a due date field; adding a date picker and overdue indicators would improve task management
- **Drag-to-reorder** — manual ordering of tasks within a priority group
- **Dark mode** — CSS custom properties are already structured for a dark theme toggle
- **Optimistic updates** — update the UI immediately on toggle/delete and roll back on API error, for a snappier feel
- **Pagination or infinite scroll** — the current implementation fetches up to 100 tasks; large lists would benefit from pagination
- **Tags / categories** — group tasks beyond the three priority levels

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

## Contact

GitHub: [@dashi-ki](https://github.com/dashi-ki)
