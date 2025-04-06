
# Database Setup for Cargo Flow Orchestrator

This document explains how to set up a PostgreSQL database for the Cargo Flow Orchestrator application.

## Prerequisites

- PostgreSQL installed on your system or accessible via a server
- Node.js and npm installed

## Database Setup Instructions

1. Create a PostgreSQL database named `cargoflow`:

```sql
CREATE DATABASE cargoflow;
```

2. Set up environment variables for your database connection:

```bash
export PGUSER=your_postgres_username
export PGHOST=localhost
export PGDATABASE=cargoflow
export PGPASSWORD=your_postgres_password
export PGPORT=5432
```

Alternatively, you can update the connection parameters directly in `server/index.js` and `server/db-setup.js`.

3. Run the database setup script to create tables and seed initial data:

```bash
node server/db-setup.js
```

4. Start the application server:

```bash
node server/index.js
```

## Database Schema

The application uses the following tables:

- **containers**: Stores information about storage containers
- **items**: Stores information about cargo items
- **placements**: Records where items are placed within containers
- **waste_operations**: Tracks waste management operations
- **logs**: Stores system event logs

## Environment Variables

You can configure the database connection using the following environment variables:

- `PGUSER`: PostgreSQL username
- `PGHOST`: PostgreSQL host
- `PGDATABASE`: PostgreSQL database name
- `PGPASSWORD`: PostgreSQL password
- `PGPORT`: PostgreSQL port

## Mock Data vs. Database Data

The application is designed to use the database when available, but falls back to mock data if the database query fails or returns no results. This makes the app resilient during development and testing.

## Troubleshooting

If you encounter issues with the database connection:

1. Ensure PostgreSQL is running
2. Verify your connection credentials
3. Check that the `cargoflow` database exists
4. Ensure the application has permission to access the database
5. Check server logs for specific error messages
