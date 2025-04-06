
module.exports = {
  items: [
    { id: "item1", name: "Food Supply Box", priority: 5, size: { x: 2, y: 2, z: 3 }, weight: 10 },
    { id: "item2", name: "Medical Equipment", priority: 9, size: { x: 1, y: 1, z: 2 }, weight: 5 },
    { id: "item3", name: "Science Experiment", priority: 7, size: { x: 3, y: 2, z: 2 }, weight: 8 },
    { id: "item4", name: "Repair Tools", priority: 6, size: { x: 2, y: 1, z: 1 }, weight: 7 },
    { id: "item5", name: "Personal Effects", priority: 3, size: { x: 1, y: 1, z: 1 }, weight: 2 },
    { id: "item6", name: "Clothing Kit", priority: 4, size: { x: 2, y: 2, z: 1 }, weight: 3 },
    { id: "item7", name: "Water Purification", priority: 8, size: { x: 2, y: 3, z: 2 }, weight: 12 },
    { id: "item8", name: "Oxygen Tanks", priority: 10, size: { x: 1, y: 3, z: 1 }, weight: 15 }
  ],
  
  containers: [
    { id: "c1", name: "Main Storage", dimensions: { x: 10, y: 10, z: 10 }, weightCapacity: 500 },
    { id: "c2", name: "Medical Bay", dimensions: { x: 5, y: 5, z: 5 }, weightCapacity: 100 },
    { id: "c3", name: "Science Lab", dimensions: { x: 8, y: 6, z: 6 }, weightCapacity: 200 },
    { id: "c4", name: "Crew Quarters", dimensions: { x: 7, y: 7, z: 4 }, weightCapacity: 150 }
  ],
  
  placementRecommendations: {
    success: true,
    placements: [
      { itemId: "item1", containerId: "c1", position: { x: 0, y: 0, z: 0 }, rotated: false },
      { itemId: "item2", containerId: "c2", position: { x: 0, y: 0, z: 0 }, rotated: false },
      { itemId: "item3", containerId: "c3", position: { x: 0, y: 0, z: 0 }, rotated: true },
      { itemId: "item4", containerId: "c1", position: { x: 2, y: 0, z: 0 }, rotated: false },
      { itemId: "item5", containerId: "c4", position: { x: 0, y: 0, z: 0 }, rotated: false },
      { itemId: "item6", containerId: "c4", position: { x: 1, y: 0, z: 0 }, rotated: false },
      { itemId: "item7", containerId: "c1", position: { x: 4, y: 0, z: 0 }, rotated: true },
      { itemId: "item8", containerId: "c1", position: { x: 6, y: 0, z: 0 }, rotated: false }
    ]
  },
  
  retrievalPlan: {
    success: true,
    steps: [
      { action: "move", itemId: "item4", from: { containerId: "c1", position: { x: 2, y: 0, z: 0 } }, to: "temp" },
      { action: "move", itemId: "item7", from: { containerId: "c1", position: { x: 4, y: 0, z: 0 } }, to: "temp" },
      { action: "retrieve", itemId: "item1", from: { containerId: "c1", position: { x: 0, y: 0, z: 0 } } },
      { action: "restore", itemId: "item4", to: { containerId: "c1", position: { x: 2, y: 0, z: 0 } } },
      { action: "restore", itemId: "item7", to: { containerId: "c1", position: { x: 4, y: 0, z: 0 } } }
    ]
  },
  
  wasteItems: {
    success: true,
    items: [
      { id: "waste1", name: "Used Food Packaging", containerId: "c1", position: { x: 8, y: 0, z: 0 }, mass: 2 },
      { id: "waste2", name: "Broken Equipment", containerId: "c3", position: { x: 4, y: 2, z: 1 }, mass: 5 },
      { id: "waste3", name: "Experiment Residue", containerId: "c3", position: { x: 6, y: 3, z: 2 }, mass: 1 }
    ]
  },
  
  wasteReturnPlan: {
    success: true,
    vesselId: "waste-return-001",
    instructions: [
      { step: 1, action: "collect", itemId: "waste1", containerId: "c1" },
      { step: 2, action: "collect", itemId: "waste2", containerId: "c3" },
      { step: 3, action: "collect", itemId: "waste3", containerId: "c3" },
      { step: 4, action: "load", items: ["waste1", "waste2", "waste3"], vesselId: "waste-return-001" },
      { step: 5, action: "seal", vesselId: "waste-return-001" },
      { step: 6, action: "undock", vesselId: "waste-return-001" }
    ],
    operationId: "waste-op-12345"
  },
  
  simulationResults: {
    success: true,
    daysPassed: 7,
    events: [
      { day: 1, event: "Item consumption", details: "Food Supply Box (item1) partially consumed" },
      { day: 3, event: "New waste generated", details: "Used Food Packaging (waste4) added to Main Storage" },
      { day: 5, event: "Item degradation", details: "Science Experiment (item3) quality reduced by 10%" },
      { day: 7, event: "Priority change", details: "Water Purification (item7) priority increased to 9" }
    ],
    updatedState: {
      items: [
        { id: "item1", name: "Food Supply Box", priority: 5, size: { x: 2, y: 2, z: 3 }, weight: 8, consumed: "20%" },
        { id: "item7", name: "Water Purification", priority: 9, size: { x: 2, y: 3, z: 2 }, weight: 12 }
      ],
      waste: [
        { id: "waste4", name: "Used Food Packaging", containerId: "c1", position: { x: 9, y: 0, z: 0 }, mass: 2 }
      ]
    }
  },
  
  currentArrangement: {
    success: true,
    timestamp: new Date().toISOString(),
    containers: [
      {
        id: "c1",
        name: "Main Storage",
        items: [
          { itemId: "item1", position: { x: 0, y: 0, z: 0 }, rotated: false },
          { itemId: "item4", position: { x: 2, y: 0, z: 0 }, rotated: false },
          { itemId: "item7", position: { x: 4, y: 0, z: 0 }, rotated: true },
          { itemId: "item8", position: { x: 6, y: 0, z: 0 }, rotated: false },
          { itemId: "waste1", position: { x: 8, y: 0, z: 0 }, rotated: false }
        ]
      },
      {
        id: "c2",
        name: "Medical Bay",
        items: [
          { itemId: "item2", position: { x: 0, y: 0, z: 0 }, rotated: false }
        ]
      },
      {
        id: "c3",
        name: "Science Lab",
        items: [
          { itemId: "item3", position: { x: 0, y: 0, z: 0 }, rotated: true },
          { itemId: "waste2", position: { x: 4, y: 2, z: 1 }, rotated: false },
          { itemId: "waste3", position: { x: 6, y: 3, z: 2 }, rotated: false }
        ]
      },
      {
        id: "c4",
        name: "Crew Quarters",
        items: [
          { itemId: "item5", position: { x: 0, y: 0, z: 0 }, rotated: false },
          { itemId: "item6", position: { x: 1, y: 0, z: 0 }, rotated: false }
        ]
      }
    ]
  },
  
  logs: {
    success: true,
    logs: [
      { timestamp: "2025-01-01T08:00:00Z", type: "placement", details: "Item 'Food Supply Box' placed in 'Main Storage'" },
      { timestamp: "2025-01-01T09:15:00Z", type: "retrieval", details: "Item 'Medical Equipment' retrieved from 'Medical Bay'" },
      { timestamp: "2025-01-02T10:30:00Z", type: "waste", details: "Waste 'Used Food Packaging' identified in 'Main Storage'" },
      { timestamp: "2025-01-03T14:45:00Z", type: "simulation", details: "Time simulation completed: 3 days" },
      { timestamp: "2025-01-05T11:20:00Z", type: "rearrangement", details: "Container 'Science Lab' optimized, 3 items rearranged" },
      { timestamp: "2025-01-07T16:10:00Z", type: "import", details: "Imported 5 new items into the system" },
      { timestamp: "2025-01-10T08:30:00Z", type: "export", details: "Current arrangement exported for external analysis" }
    ]
  }
};
