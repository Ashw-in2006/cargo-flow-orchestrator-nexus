
const { Pool } = require('pg');
const mockData = require('./mockData');

// PostgreSQL connection setup
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'cargoflow',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
});

// Create database tables
const setupDatabase = async () => {
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database');

    // Create containers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS containers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        dimensions_x INTEGER NOT NULL,
        dimensions_y INTEGER NOT NULL,
        dimensions_z INTEGER NOT NULL,
        weight_capacity FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Containers table created');

    // Create items table
    await client.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        priority INTEGER NOT NULL,
        size_x FLOAT NOT NULL,
        size_y FLOAT NOT NULL,
        size_z FLOAT NOT NULL,
        weight FLOAT NOT NULL,
        container_id INTEGER REFERENCES containers(id),
        position_x FLOAT,
        position_y FLOAT,
        position_z FLOAT,
        category VARCHAR(100),
        is_waste BOOLEAN DEFAULT FALSE,
        expiry_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Items table created');

    // Create placements table
    await client.query(`
      CREATE TABLE IF NOT EXISTS placements (
        id SERIAL PRIMARY KEY,
        item_id INTEGER REFERENCES items(id),
        container_id INTEGER REFERENCES containers(id),
        position_x FLOAT NOT NULL,
        position_y FLOAT NOT NULL,
        position_z FLOAT NOT NULL,
        rotated BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Placements table created');

    // Create waste_operations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS waste_operations (
        id SERIAL PRIMARY KEY,
        operation_id VARCHAR(100) UNIQUE NOT NULL,
        status VARCHAR(50) NOT NULL,
        vessel_id VARCHAR(100),
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        items TEXT[]
      )
    `);
    console.log('Waste operations table created');

    // Create logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS logs (
        id SERIAL PRIMARY KEY,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        type VARCHAR(50) NOT NULL,
        details JSONB,
        user_id VARCHAR(100)
      )
    `);
    console.log('Logs table created');

    // Seed data if tables are empty
    const seedData = async () => {
      // Check if containers table is empty
      const containersResult = await client.query('SELECT COUNT(*) FROM containers');
      if (parseInt(containersResult.rows[0].count) === 0) {
        console.log('Seeding containers data...');
        for (const container of mockData.containers) {
          await client.query(
            'INSERT INTO containers (name, dimensions_x, dimensions_y, dimensions_z, weight_capacity) VALUES ($1, $2, $3, $4, $5)',
            [container.name, container.dimensions.x, container.dimensions.y, container.dimensions.z, container.weightCapacity]
          );
        }
      }

      // Check if items table is empty
      const itemsResult = await client.query('SELECT COUNT(*) FROM items');
      if (parseInt(itemsResult.rows[0].count) === 0) {
        console.log('Seeding items data...');
        for (const item of mockData.items) {
          await client.query(
            'INSERT INTO items (name, priority, size_x, size_y, size_z, weight, category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [item.name, item.priority, item.size.x, item.size.y, item.size.z, item.weight, item.name.split(' ')[0].toLowerCase()]
          );
        }
      }

      console.log('Seed data complete');
    };

    await seedData();
    console.log('Database setup completed successfully');
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('Error setting up database:', error);
  }
};

setupDatabase();
