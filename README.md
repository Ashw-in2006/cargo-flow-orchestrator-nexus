
# Cargo Flow Orchestrator

This application optimizes cargo placement, retrieval, and waste management with advanced algorithms.

## Features

- Cargo placement optimization
- Item search and retrieval
- Waste management
- Time simulation
- Analytics dashboard
- 3D container visualization

## Requirements

- Node.js (v14 or higher)
- Docker (for containerized deployment)

## Local Development

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cargo-flow-orchestrator.git
   cd cargo-flow-orchestrator
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080`

## Docker Deployment

1. Build the Docker image:
   ```
   docker build -t cargo-flow-orchestrator .
   ```

2. Run the Docker container:
   ```
   docker run -p 8000:8000 cargo-flow-orchestrator
   ```

3. Access the application at `http://localhost:8000`

## API Endpoints

The application provides the following API endpoints:

1. Placement Recommendations API: `/api/placement`
2. Item Search and Retrieval API: `/api/search`, `/api/retrieve`, `/api/place`
3. Waste Management API: `/api/waste/identify`, `/api/waste/return-plan`, `/api/waste/complete-undocking`
4. Time Simulation API: `/api/simulate/day`
5. Import/Export API: `/api/import/items`, `/api/import/containers`, `/api/export/arrangement`
6. Logging API: `/api/logs`

## Implementation

The application uses an advanced algorithm for cargo placement optimization that considers:

- Item priority levels
- Space efficiency
- Access frequency
- Weight distribution
- Structural integrity

Data structures implemented:
- 3D grid representation for containers
- Priority queues for item handling
- Graph-based retrieval path optimization

For more detailed information, please refer to the technical documentation.

