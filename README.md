# TaskerBot Dashboard

A comprehensive dashboard for managing TaskerBot, featuring Discord authentication, objective tracking, proof submission, and dynamic bot settings. Built with Next.js 16, TypeScript, and Tailwind CSS.

## Features

*   **Discord Authentication**: Secure login using NextAuth.js with Discord provider.
*   **Objective Tracking**: Create, view, and manage daily/weekly/monthly objectives.
*   **Proof Feed**: Submit photo proofs for objectives (stored locally in browser via IndexedDB).
*   **Dynamic Settings**: Configure bot settings (e.g., Message Visibility) which are stored in a cloud-hosted Turso database.
*   **Dark Mode**: Fully styled with a Discord-inspired dark theme.
*   **Deployment Ready**: Optimized for Vercel deployment.

## Prerequisites

*   Node.js 20+ (for local development)
*   A Discord Application (for OAuth)
*   A Turso Database account

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
    
    # Turso Database
    TURSO_DATABASE_URL=libsql://your-db-name.turso.io
    TURSO_AUTH_TOKEN=your-turso-auth-token
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the dashboard:**
    Visit [http://localhost:3000](http://localhost:3000).

## Deployment (Vercel)

This project is optimized for deployment on Vercel.

1.  **Push to GitHub**: Ensure your code is pushed to a GitHub repository.
2.  **Import to Vercel**: Create a new project in Vercel and import your repository.
3.  **Environment Variables**: Add the following variables in the Vercel Project Settings:
    *   `DISCORD_CLIENT_ID`
    *   `DISCORD_CLIENT_SECRET`
    *   `NEXTAUTH_SECRET`
    *   `NEXTAUTH_URL` (Set to your Vercel domain, e.g., `https://your-project.vercel.app`)
    *   `TURSO_DATABASE_URL`
    *   `TURSO_AUTH_TOKEN`
4.  **Discord Redirects**: Go to the Discord Developer Portal -> OAuth2 -> Redirects and add:
    `https://your-project.vercel.app/api/auth/callback/discord`

## Project Structure

*   `src/app`: Next.js App Router pages and API routes.
*   `src/components`: React components (SettingsForm, Feed, etc.).
*   `src/lib`: Utility functions and database connections (`db.ts`).

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Auth**: NextAuth.js
*   **Database**: Turso (@libsql/client)
*   **Deployment**: Vercel
