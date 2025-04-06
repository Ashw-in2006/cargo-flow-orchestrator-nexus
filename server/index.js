
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

// Mock data
const mockData = require('./mockData');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
// 1. Placement Recommendations API
app.post('/api/placement', (req, res) => {
  const { items } = req.body;
  console.log('Placement recommendation requested for items:', items);
  res.json(mockData.placementRecommendations);
});

// 2. Item Search API
app.get('/api/search', (req, res) => {
  const { query } = req.query;
  console.log('Search requested for:', query);
  const results = mockData.items.filter(item => 
    item.name.toLowerCase().includes((query || '').toLowerCase())
  );
  res.json({ results });
});

// Retrieve API
app.post('/api/retrieve', (req, res) => {
  const { itemId } = req.body;
  console.log('Retrieve requested for item:', itemId);
  res.json(mockData.retrievalPlan);
});

// Place API
app.post('/api/place', (req, res) => {
  const { itemId, containerId, position } = req.body;
  console.log(`Placing item ${itemId} in container ${containerId} at position ${JSON.stringify(position)}`);
  res.json({ success: true, message: 'Item placed successfully' });
});

// 3. Waste Management API
app.get('/api/waste/identify', (req, res) => {
  console.log('Waste identification requested');
  res.json(mockData.wasteItems);
});

app.post('/api/waste/return-plan', (req, res) => {
  const { itemIds } = req.body;
  console.log('Return plan requested for waste items:', itemIds);
  res.json(mockData.wasteReturnPlan);
});

app.post('/api/waste/complete-undocking', (req, res) => {
  const { operationId } = req.body;
  console.log('Undocking completed for operation:', operationId);
  res.json({ success: true, message: 'Undocking completed successfully' });
});

// 4. Time Simulation API
app.post('/api/simulate/day', (req, res) => {
  const { days } = req.body;
  console.log(`Simulating ${days} day(s)`);
  res.json(mockData.simulationResults);
});

// 5. Import/Export API
app.post('/api/import/items', (req, res) => {
  const { items } = req.body;
  console.log('Importing items:', items);
  res.json({ success: true, count: items.length });
});

app.post('/api/import/containers', (req, res) => {
  const { containers } = req.body;
  console.log('Importing containers:', containers);
  res.json({ success: true, count: containers.length });
});

app.get('/api/export/arrangement', (req, res) => {
  console.log('Exporting current arrangement');
  res.json(mockData.currentArrangement);
});

// 6. Logging API
app.get('/api/logs', (req, res) => {
  const { startDate, endDate, type } = req.query;
  console.log(`Fetching logs from ${startDate} to ${endDate} of type ${type}`);
  res.json(mockData.logs);
});

// Serve the frontend for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
