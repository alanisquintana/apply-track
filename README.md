`React` `TypeScript` `NestJS` `PostgreSQL` `Docker`

# ApplyTrack

A **web application** to keep track of every job you've applied to — company, status, and dates — all in one simple place.

No spreadsheets, no sticky notes. Just a clean list of your applications that you run in your browser on your own machine.

## What can it do?

- Add a job application with company name, status, and date
- Update the status as things move forward (Applied → Interviewing → Offer → Rejected)
- Edit or delete any application
- Runs entirely on your own machine — your data stays with you

## Before you start

You don't need to know how to code to run this app. You just need three free programs installed on your computer:

1. **[Docker](https://docs.docker.com/get-docker/)** — this is what runs the app for you, without you needing to install anything else (no need to set up databases or servers by hand). Download it, install it like any other program, and open it once so it's running in the background.
2. **[Git](https://git-scm.com/downloads)** — this is what downloads the project files to your computer.
3. **Make** — a small tool used to run the setup command. It already comes installed on Mac and Linux. On Windows, the easiest way is to install [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) first (Windows Subsystem for Linux), which gives you a Mac/Linux-like terminal.

That's it — you do **not** need to install Node.js, PostgreSQL, or anything else. Docker takes care of all of that for you.

## How to install and run it

Open your computer's terminal (on Mac: search for "Terminal"; on Windows: open the WSL terminal you installed above) and paste this single command:

```bash
curl -fsSL https://raw.githubusercontent.com/AlanisQuintana/applytrack/main/install.sh | bash
```

Press Enter and wait. This one line will:

1. Check that Docker, Git, and Make are installed
2. Download the app to a folder called `applytrack` in your home directory
3. Set everything up and start the app automatically

When it's done, you'll see a message saying it's running. Open your browser and go to:

👉 **http://localhost:3000**

That's the app — you can start adding your job applications right away.

> Curious what the install command actually does before running it? You can read it here: [install.sh](install.sh). It doesn't do anything hidden — just checks your setup and starts the app.

## Everyday use

Once installed, you don't need to run that command again. To use the app later:

- **Start the app**: open a terminal, go to the folder (`cd ~/applytrack`), and run `make up`
- **Stop the app**: run `make down` in that same folder
- Your data is saved automatically and will still be there the next time you start it up

## Something not working?

- Make sure Docker is open and running in the background before starting the app
- If a port is "already in use", another program on your computer might be using it — check `.env` to change the port
- Still stuck? Open an [issue](../../issues) describing what happened and we'll help out

---

## For developers

The sections below are for anyone who wants to explore the code, contribute, or set things up manually instead of using the install script.

### Manual setup

```bash
git clone https://github.com/AlanisQuintana/applytrack.git
cd applytrack
cp .env.example .env
make up
```

This builds the frontend, backend, and database images, starts everything with Docker Compose, and runs database migrations automatically.

- Frontend (web UI): http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: `localhost:5432`

### Available Make commands

| Command          | Description                                      |
|-------------------|--------------------------------------------------|
| `make up`         | Build and start all services                     |
| `make down`       | Stop all services                                 |
| `make restart`    | Restart all services                              |
| `make logs`       | Tail logs from all containers                     |
| `make migrate`    | Run database migrations manually                 |
| `make seed`       | Seed the database with sample data                |
| `make clean`      | Stop services and remove volumes (resets the DB)  |
| `make test`       | Run backend and frontend test suites              |

### Project structure

```
applytrack/
├── frontend/           # React + TypeScript SPA (Single Page Application)
├── backend/            # NestJS REST API
├── docker-compose.yml  # Service orchestration
├── Makefile             # Command shortcuts
├── .env.example         # Environment variable template
└── README.md
```

### Environment variables

| Variable            | Description                          | Default        |
|-----------------------|----------------------------------------|----------------|
| `POSTGRES_USER`        | Database username                    | `applytrack`   |
| `POSTGRES_PASSWORD`    | Database password                    | `applytrack`   |
| `POSTGRES_DB`           | Database name                        | `applytrack`   |
| `DATABASE_URL`          | Full connection string for the API   | auto-generated |
| `API_PORT`              | Port for the backend API             | `3001`         |
| `FRONTEND_PORT`         | Port for the frontend                | `3000`         |

See `.env.example` for the full list.

### API overview

| Method | Endpoint            | Description                  |
|--------|----------------------|-------------------------------|
| GET    | `/applications`      | List all applications         |
| GET    | `/applications/:id`  | Get a single application      |
| POST   | `/applications`      | Create a new application      |
| PATCH  | `/applications/:id`  | Update an application         |
| DELETE | `/applications/:id`  | Delete an application         |

### Contributing

Contributions are welcome! Please open an issue to discuss what you'd like to change before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push and open a pull request

### License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
