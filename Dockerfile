
FROM ubuntu:22.04

# Set working directory
WORKDIR /app

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Update npm
RUN npm install -g npm@latest

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Create a server directory
RUN mkdir -p server

# Create server files
COPY server ./server

# Expose port for API access
EXPOSE 8000

# Start the application
CMD ["node", "server/index.js"]
