# ApplyTrack

A **desktop application** to keep track of every job you've applied to — company, status, and dates — all in one simple place.

No spreadsheets, no sticky notes. Just a clean local app that runs on your machine.

## What can it do?

- Add a job application with company name, status, and date
- Update the status as things move forward (Applied → Interviewing → Offer → Rejected)
- Edit or delete any application
- Runs entirely on your own machine — your data stays with you

## Download

Download the latest installer from the [Releases](https://github.com/alanisquintana/apply-track/releases) page:

- `ApplyTrack_x64-setup.exe`

Run it and the app is ready — no dependencies required.

## For developers

### Requirements

- **Node.js** 20 or newer
- **Rust** (latest stable) — only needed to build the Tauri desktop app

### Quick start (browser dev mode)

```bash
git clone https://github.com/alanisquintana/apply-track.git
cd applytrack
node start.js
```

Open **http://localhost:3000** in your browser.

### Desktop dev mode

```bash
cd frontend
npm run tauri:dev
```

This builds the backend executable, starts the Vite dev server, and opens the Tauri desktop window connected to it.

### Build the desktop installer

```bash
cd frontend
npm run tauri:build
```

Output is in `frontend/src-tauri/target/release/bundle/`.

### Manual setup

```bash
git clone https://github.com/alanisquintana/apply-track.git
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

| Command                 | Description                                     |
|------------------------|-------------------------------------------------|
| `node start.js`        | Build and start both servers (browser mode)     |
| `make tauri-dev`       | Launch desktop app in dev mode                  |
| `make tauri-build`     | Build desktop installer                         |
| `make seed`            | Seed the database with sample data (5 apps)     |
| `make test`            | Run backend e2e tests                         |

### Project structure

```
applytrack/
├── frontend/             # React + TypeScript SPA
│   └── src-tauri/        # Tauri Rust shell + config
│       ├── src/lib.rs    # Backend sidecar launcher
│       ├── binaries/     # Backend SEA executable
│       └── tauri.conf.json
├── backend/              # NestJS REST API
│   ├── src/
│   │   ├── applications/  # CRUD module
│   │   ├── database/      # SQLite configuration
│   │   └── seed.ts        # Database seed script
│   ├── build-sea.js       # Builds backend as single executable
│   └── data/              # SQLite database file (gitignored)
├── .env.example           # Environment variable template
├── start.js               # Browser-mode launcher
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
