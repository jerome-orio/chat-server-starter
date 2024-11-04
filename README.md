# Real-Time Chat Application Server - Starter Project

This is the server-side application for a real-time chat system built with Express, Socket.IO, and deployable to Cloudflare Workers.

## Features

- Real-time WebSocket communication
- Express server for local development
- Cloudflare Workers compatible for deployment
- Easy integration with the chat client

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- Wrangler CLI (for Cloudflare Workers deployment)

## Installation

To install the chat server, follow these steps:

1. Clone the repository:
```
git clone <repository-url>
cd chat-server-starter
```

2. Install the dependencies:
```
npm install
```

## Running the Server Locally

To run the chat server locally, use the following command:

```
npm run dev
```

The server will be available at `http://localhost:3001`.

## Building for Production

To create a production build, run:

```
npm run build
```

## Deployment to Cloudflare Workers

To deploy the server to Cloudflare Workers:

1. Ensure you have the Wrangler CLI installed and configured.
2. Run the following command:
```
npm run deploy
```

## Project Structure

- `/src`: Contains the main server code
  - `index.ts`: Entry point for Cloudflare Workers
  - `server.ts`: Express server for local development
- `wrangler.toml`: Configuration file for Cloudflare Workers
- `tsconfig.json`: TypeScript configuration

## Configuration

- For local development, the server uses the configuration in `src/server.ts`.
- For Cloudflare Workers deployment, the configuration is in `src/index.ts` and `wrangler.toml`.

## Contact

Feel free to reach out for collaborations or inquiries:
* Email: [jrorio.dev@zohomail.com](mailto:jrorio.dev@zohomail.com)
* LinkedIn: [Jerome Orio](https://www.linkedin.com/in/jerome-orio-dev)