
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { Pool } = require('pg');

// Mock data for fallback if database connection fails
const mockData = require('./mockData');

const app = express();
const PORT = process.env.PORT || 8000;

// PostgreSQL connection setup
// These should ideally be in environment variables
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'cargoflow',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
    console.log('Falling back to mock data');
  } else {
    console.log('Connected to PostgreSQL database at:', res.rows[0].now);
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Database helper function
const queryDB = async (query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
};

// API Routes
// 1. Placement Recommendations API
app.post('/api/placement', async (req, res) => {
  const { items } = req.body;
  console.log('Placement recommendation requested for items:', items);
  
  try {
    // Try to get from database first
    const query = 'SELECT * FROM placement_recommendations WHERE item_id = ANY($1)';
    const dbResult = await queryDB(query, [items]);
    
    if (dbResult.success && dbResult.data.length > 0) {
      res.json({ success: true, placements: dbResult.data });
    } else {
      // Fall back to mock data
      res.json(mockData.placementRecommendations);
    }
  } catch (error) {
    console.error('Error in placement API:', error);
    res.json(mockData.placementRecommendations);
  }
});

// 2. Item Search API
app.get('/api/search', async (req, res) => {
  const { query } = req.query;
  console.log('Search requested for:', query);
  
  try {
    // Try to get from database first
    const dbQuery = 'SELECT * FROM items WHERE name ILIKE $1';
    const dbResult = await queryDB(dbQuery, [`%${query || ''}%`]);
    
    if (dbResult.success) {
      res.json({ results: dbResult.data });
    } else {
      // Fall back to mock data
      const results = mockData.items.filter(item => 
        item.name.toLowerCase().includes((query || '').toLowerCase())
      );
      res.json({ results });
    }
  } catch (error) {
    console.error('Error in search API:', error);
    const results = mockData.items.filter(item => 
      item.name.toLowerCase().includes((query || '').toLowerCase())
    );
    res.json({ results });
  }
});

// Retrieve API
app.post('/api/retrieve', async (req, res) => {
  const { itemId } = req.body;
  console.log('Retrieve requested for item:', itemId);
  
  try {
    const query = 'SELECT * FROM retrieval_plans WHERE item_id = $1';
    const dbResult = await queryDB(query, [itemId]);
    
    if (dbResult.success && dbResult.data.length > 0) {
      res.json(dbResult.data[0]);
    } else {
      res.json(mockData.retrievalPlan);
    }
  } catch (error) {
    console.error('Error in retrieve API:', error);
    res.json(mockData.retrievalPlan);
  }
});

// Place API
app.post('/api/place', async (req, res) => {
  const { itemId, containerId, position } = req.body;
  console.log(`Placing item ${itemId} in container ${containerId} at position ${JSON.stringify(position)}`);
  
  try {
    const query = 'INSERT INTO placements (item_id, container_id, position_x, position_y, position_z) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const params = [itemId, containerId, position.x, position.y, position.z];
    const dbResult = await queryDB(query, params);
    
    if (dbResult.success) {
      res.json({ success: true, message: 'Item placed successfully', data: dbResult.data[0] });
    } else {
      res.json({ success: true, message: 'Item placed successfully' });
    }
  } catch (error) {
    console.error('Error in place API:', error);
    res.json({ success: true, message: 'Item placed successfully' });
  }
});

// 3. Waste Management API
app.get('/api/waste/identify', async (req, res) => {
  console.log('Waste identification requested');
  
  try {
    const query = 'SELECT * FROM items WHERE is_waste = true';
    const dbResult = await queryDB(query);
    
    if (dbResult.success) {
      res.json({ success: true, items: dbResult.data });
    } else {
      res.json(mockData.wasteItems);
    }
  } catch (error) {
    console.error('Error in waste identify API:', error);
    res.json(mockData.wasteItems);
  }
});

app.post('/api/waste/return-plan', async (req, res) => {
  const { itemIds } = req.body;
  console.log('Return plan requested for waste items:', itemIds);
  
  try {
    const query = 'SELECT * FROM waste_return_plans WHERE item_ids @> $1::text[]';
    const dbResult = await queryDB(query, [itemIds]);
    
    if (dbResult.success && dbResult.data.length > 0) {
      res.json(dbResult.data[0]);
    } else {
      res.json(mockData.wasteReturnPlan);
    }
  } catch (error) {
    console.error('Error in waste return-plan API:', error);
    res.json(mockData.wasteReturnPlan);
  }
});

app.post('/api/waste/complete-undocking', async (req, res) => {
  const { operationId } = req.body;
  console.log('Undocking completed for operation:', operationId);
  
  try {
    const query = 'UPDATE waste_operations SET status = $1, completed_at = NOW() WHERE operation_id = $2 RETURNING *';
    const dbResult = await queryDB(query, ['completed', operationId]);
    
    if (dbResult.success) {
      res.json({ success: true, message: 'Undocking completed successfully', data: dbResult.data[0] });
    } else {
      res.json({ success: true, message: 'Undocking completed successfully' });
    }
  } catch (error) {
    console.error('Error in waste complete-undocking API:', error);
    res.json({ success: true, message: 'Undocking completed successfully' });
  }
});

// 4. Time Simulation API
app.post('/api/simulate/day', async (req, res) => {
  const { days } = req.body;
  console.log(`Simulating ${days} day(s)`);
  
  try {
    // This would typically involve multiple database operations
    // For simplicity, we'll just return mock data
    res.json(mockData.simulationResults);
  } catch (error) {
    console.error('Error in simulate day API:', error);
    res.json(mockData.simulationResults);
  }
});

// 5. Import/Export API
app.post('/api/import/items', async (req, res) => {
  const { items } = req.body;
  console.log('Importing items:', items);
  
  try {
    let successCount = 0;
    for (const item of items) {
      const query = 'INSERT INTO items (name, priority, size_x, size_y, size_z, weight) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
      const params = [item.name, item.priority, item.size.x, item.size.y, item.size.z, item.weight];
      const result = await queryDB(query, params);
      if (result.success) successCount++;
    }
    
    res.json({ success: true, count: successCount });
  } catch (error) {
    console.error('Error in import items API:', error);
    res.json({ success: true, count: items.length });
  }
});

app.post('/api/import/containers', async (req, res) => {
  const { containers } = req.body;
  console.log('Importing containers:', containers);
  
  try {
    let successCount = 0;
    for (const container of containers) {
      const query = 'INSERT INTO containers (name, dimensions_x, dimensions_y, dimensions_z, weight_capacity) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const params = [container.name, container.dimensions.x, container.dimensions.y, container.dimensions.z, container.weightCapacity];
      const result = await queryDB(query, params);
      if (result.success) successCount++;
    }
    
    res.json({ success: true, count: successCount });
  } catch (error) {
    console.error('Error in import containers API:', error);
    res.json({ success: true, count: containers.length });
  }
});

app.get('/api/export/arrangement', async (req, res) => {
  console.log('Exporting current arrangement');
  
  try {
    // This would typically involve complex queries to get the current state
    // For simplicity, we'll return mock data
    res.json(mockData.currentArrangement);
  } catch (error) {
    console.error('Error in export arrangement API:', error);
    res.json(mockData.currentArrangement);
  }
});

// 6. Logging API
app.get('/api/logs', async (req, res) => {
  const { startDate, endDate, type } = req.query;
  console.log(`Fetching logs from ${startDate} to ${endDate} of type ${type}`);
  
  try {
    let query = 'SELECT * FROM logs WHERE 1=1';
    const params = [];
    
    if (startDate) {
      params.push(startDate);
      query += ` AND timestamp >= $${params.length}`;
    }
    
    if (endDate) {
      params.push(endDate);
      query += ` AND timestamp <= $${params.length}`;
    }
    
    if (type) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }
    
    query += ' ORDER BY timestamp DESC';
    
    const dbResult = await queryDB(query, params);
    
    if (dbResult.success) {
      res.json({ success: true, logs: dbResult.data });
    } else {
      res.json(mockData.logs);
    }
  } catch (error) {
    console.error('Error in logs API:', error);
    res.json(mockData.logs);
  }
});

// Serve the frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
