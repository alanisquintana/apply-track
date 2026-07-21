# ApplyTrack

A **web application** to keep track of every job you've applied to — company, status, and dates — all in one simple place.

No spreadsheets, no sticky notes. Just a clean list of your applications that you run in your browser on your own machine.

## What can it do?

- Add a job application with company name, status, and date
- Update the status as things move forward (Applied → Interviewing → Offer → Rejected)
- Edit or delete any application
- Runs entirely on your own machine — your data stays with you

## Before you start

You need one program installed:

1. **[Node.js](https://nodejs.org/)** 20 or newer

That's it. You do **not** need Docker, PostgreSQL, or anything else.

## How to install and run it

Open your computer's terminal and paste:

```bash
git clone https://github.com/AlanisQuintana/applytrack.git
cd applytrack
node start.js
```

This will install dependencies, build the backend, and start both servers.

Open **http://localhost:3000** in your browser — the app is ready.

## Everyday use

- **Start the app**: go to the folder and run `node start.js`
- **Your data is saved automatically** in a local SQLite file — it will be there next time you start the app

## Something not working?

- Make sure Node.js 20+ is installed (`node -v`)
- If a port is already in use, change `API_PORT` in `.env`
- Still stuck? Open an [issue](../../issues) describing what happened

---

## For developers

### Manual setup

```bash
git clone https://github.com/AlanisQuintana/applytrack.git
cd applytrack
cp .env.example .env
node start.js
```

- Frontend (web UI): http://localhost:3000
- Backend API: http://localhost:3001
- Database: SQLite at `backend/data/applytrack.db`

To seed the database with sample data after starting:

```bash
make seed
```

### Available commands

| Command      | Description                                     |
|-------------|-------------------------------------------------|
| `node start.js` | Build and start both servers                 |
| `make seed`    | Seed the database with sample data (5 applications) |
| `make test`    | Run backend e2e tests                         |

### Project structure

```
applytrack/
├── frontend/             # React + TypeScript SPA
├── backend/              # NestJS REST API
│   ├── src/
│   │   ├── applications/  # CRUD module
│   │   ├── database/      # SQLite configuration
│   │   └── seed.ts        # Database seed script
│   └── data/              # SQLite database file (gitignored)
├── .env.example           # Environment variable template
├── start.js               # Single-command launcher
├── Makefile               # Command shortcuts
└── README.md
```

### Environment variables

| Variable    | Description           | Default  |
|-------------|-----------------------|----------|
| `API_PORT`  | Port for the backend  | `3001`   |

See `.env.example` for the full list.

### API overview

| Method | Endpoint            | Description                  |
|--------|----------------------|------------------------------|
| GET    | `/applications`      | List all applications         |
| GET    | `/applications/:id`  | Get a single application      |
| POST   | `/applications`      | Create a new application      |
| PATCH  | `/applications/:id`  | Update an application         |
| DELETE | `/applications/:id`  | Delete an application         |

### Color system

All colors are defined in `frontend/src/theme/colors.ts`. No color value is hardcoded in component files or inline styles. Every color either comes from the `colors` export (for JS) or a matching `var(--...)` CSS custom property in `index.css` (for CSS).

| CSS variable   | Value      | Usage                 |
|----------------|------------|-----------------------|
| `--background` | `#0f0f23`  | Page background       |
| `--surface`    | `#1a1a2e`  | Card/surface bg       |
| `--text`       | `#f5f5f5`  | All application text  |
| `--primary`    | `#2563eb`  | Primary accent        |
| `--danger`     | `#ff4d4f`  | Delete/danger icons   |

### Contributing

Contributions are welcome! Please open an issue to discuss what you'd like to change before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a pull request

### License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
