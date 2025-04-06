
const express = require('express');
const router = express.Router();

// Import database connection pool (assuming it's exported from main server file)
// const { pool } = require('../index');

// Helper function for database queries
const queryDB = async (pool, query, params = []) => {
  try {
    const result = await pool.query(query, params);
    return { success: true, data: result.rows };
  } catch (error) {
    console.error('Database query error:', error);
    return { success: false, error: error.message };
  }
};

// Get space utilization
router.get('/space-utilization', async (req, res) => {
  try {
    // This would normally query the database for real-time calculations
    // For now, return mock data
    res.json({
      success: true,
      data: {
        currentPercentage: 74.3,
        trend: 5.2,
        history: [
          { period: 'Jan', percentage: 65 },
          { period: 'Feb', percentage: 59 },
          { period: 'Mar', percentage: 80 },
          { period: 'Apr', percentage: 81 },
          { period: 'May', percentage: 56 },
          { period: 'Jun', percentage: 55 },
        ]
      }
    });
  } catch (error) {
    console.error('Error in space utilization API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get item counts
router.get('/item-counts', async (req, res) => {
  try {
    // This would normally query the database
    res.json({
      success: true,
      data: {
        total: 55,
        byPriority: [
          { priority: 'High', count: 12 },
          { priority: 'Medium', count: 25 },
          { priority: 'Low', count: 18 },
        ]
      }
    });
  } catch (error) {
    console.error('Error in item counts API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get waste generation
router.get('/waste-generation', async (req, res) => {
  try {
    // This would normally query the database
    res.json({
      success: true,
      data: {
        averagePerWeek: 6.2,
        trend: 12.5,
        history: [
          { period: 'Week 1', amount: 5 },
          { period: 'Week 2', amount: 7 },
          { period: 'Week 3', amount: 3 },
          { period: 'Week 4', amount: 9 },
        ]
      }
    });
  } catch (error) {
    console.error('Error in waste generation API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get category distribution
router.get('/category-distribution', async (req, res) => {
  try {
    // This would normally query the database
    res.json({
      success: true,
      data: [
        { name: 'Medical', value: 25 },
        { name: 'Food', value: 30 },
        { name: 'Science', value: 15 },
        { name: 'Maintenance', value: 20 },
        { name: 'Personal', value: 10 },
      ]
    });
  } catch (error) {
    console.error('Error in category distribution API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get container capacity usage
router.get('/container-capacity', async (req, res) => {
  try {
    // This would normally query the database
    res.json({
      success: true,
      data: [
        { name: 'Container A', capacity: 1600, used: 1200 },
        { name: 'Container B', capacity: 1800, used: 900 },
        { name: 'Container C', capacity: 576, used: 400 },
      ]
    });
  } catch (error) {
    console.error('Error in container capacity API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all analytics data in a single request
router.get('/dashboard', async (req, res) => {
  try {
    // This would normally query the database for all metrics
    res.json({
      success: true,
      data: {
        spaceUtilization: { 
          percentage: 74.3, 
          trend: 5.2,
          history: [
            { period: 'Jan', percentage: 65 },
            { period: 'Feb', percentage: 59 },
            { period: 'Mar', percentage: 80 },
            { period: 'Apr', percentage: 81 },
            { period: 'May', percentage: 56 },
            { period: 'Jun', percentage: 55 },
          ]
        },
        itemCounts: {
          total: 55,
          byPriority: [
            { priority: 'High', count: 12 },
            { priority: 'Medium', count: 25 },
            { priority: 'Low', count: 18 },
          ]
        },
        wasteGeneration: {
          averagePerWeek: 6.2,
          trend: 12.5,
          history: [
            { period: 'Week 1', amount: 5 },
            { period: 'Week 2', amount: 7 },
            { period: 'Week 3', amount: 3 },
            { period: 'Week 4', amount: 9 },
          ]
        },
        categoryDistribution: [
          { name: 'Medical', value: 25 },
          { name: 'Food', value: 30 },
          { name: 'Science', value: 15 },
          { name: 'Maintenance', value: 20 },
          { name: 'Personal', value: 10 },
        ],
        containerCapacity: [
          { name: 'Container A', capacity: 1600, used: 1200 },
          { name: 'Container B', capacity: 1800, used: 900 },
          { name: 'Container C', capacity: 576, used: 400 },
        ]
      }
    });
  } catch (error) {
    console.error('Error in dashboard API:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
