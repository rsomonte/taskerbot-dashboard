# TaskerBot Dashboard

A comprehensive dashboard for managing TaskerBot, featuring Discord authentication, objective tracking, proof submission, and dynamic bot settings. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

*   **Discord Authentication**: Secure login using NextAuth.js with Discord provider.
*   **Objective Tracking**: Create, view, and manage daily/weekly/monthly objectives.
*   **Proof Feed**: Submit photo proofs for objectives (stored locally in browser via IndexedDB).
*   **Dynamic Settings**: Configure bot settings (e.g., Message Visibility) which are stored in a server-side SQLite database.
*   **Dark Mode**: Fully styled with a Discord-inspired dark theme.
*   **Docker Ready**: Includes Dockerfile and configuration for easy containerized deployment.

## Prerequisites

*   Node.js 20+ (for local development)
*   Docker & Docker Compose (for deployment)
*   A Discord Application (for OAuth)

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/rsomonte/taskerbot-dashboard.git
    cd taskerbot-dashboard
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    # Discord OAuth
    DISCORD_CLIENT_ID=your_discord_client_id
    DISCORD_CLIENT_SECRET=your_discord_client_secret
    
    # NextAuth
    NEXTAUTH_SECRET=your_random_secret_string
    NEXTAUTH_URL=http://localhost:3000
    
    # Database Paths (Absolute paths for local dev)
    DATABASE_PATH=C:/path/to/your/objectives.db
    SETTINGS_DATABASE_PATH=C:/path/to/your/settings.db
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the dashboard:**
    Visit [http://localhost:3000](http://localhost:3000).

## Docker Deployment

The project is configured for production deployment using Docker.

### 1. Build the Image
```bash
docker build -t rsomonte/taskerbot-dashboard .
```

### 2. Run with Docker Compose
Add the dashboard service to your `docker-compose.yml`. Ensure it shares the data volume with your bot container so they can access the same SQLite databases.

```yaml
services:
  dashboard:
    image: rsomonte/taskerbot-dashboard:latest
    container_name: taskerbot_dashboard
    restart: unless-stopped
    volumes:
      # Mount the host data folder to /app/data inside the container
      - ./data:/app/data
    environment:
      - DATABASE_PATH=/app/data/objectives.db
      - SETTINGS_DATABASE_PATH=/app/data/settings.db
      - NEXTAUTH_URL=https://dashboard.yourdomain.com
      - NEXTAUTH_SECRET=your_secret
      - DISCORD_CLIENT_ID=your_id
      - DISCORD_CLIENT_SECRET=your_secret
    networks:
      - default
```

### 3. Reverse Proxy (Caddy)
If using Caddy, you can serve the dashboard on a subdomain:

```caddy
dashboard.yourdomain.com {
    reverse_proxy taskerbot_dashboard:3000
}
```

## Project Structure

*   `src/app`: Next.js App Router pages and API routes.
*   `src/components`: React components (SettingsForm, Feed, etc.).
*   `src/lib`: Utility functions and database connections (`db.ts`, `settingsDb.ts`).
*   `objectives.db`: SQLite database for user objectives.
*   `settings.db`: SQLite database for dynamic bot settings.

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Auth**: NextAuth.js
*   **Database**: better-sqlite3 (Server), idb (Client-side)
*   **Deployment**: Docker
