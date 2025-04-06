
import { toast } from "sonner";

// Base API URL - would be replaced with actual API URL in production
const API_BASE_URL = "http://localhost:8000/api";

// API request with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    toast.error(errorMessage);
    throw error;
  }
}

// Type definitions
export interface Container {
  id: string;
  name: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  capacity: number;
  currentLoad: number;
  items: Item[];
}

export interface Item {
  id: string;
  name: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  weight: number;
  priority: "high" | "medium" | "low";
  containerId?: string;
  position?: {
    x: number;
    y: number;
    z: number;
  };
  category: string;
  expiryDate?: string;
  isWaste?: boolean;
}

export interface PlacementRecommendation {
  itemId: string;
  containerId: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  priorityScore: number;
  reasonings: string[];
}

export interface SearchResult {
  items: Item[];
  totalResults: number;
}

export interface WasteItem extends Item {
  isWaste: true;
  wasteCategory?: string;
  disposalDate?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  operation: string;
  details: Record<string, any>;
  userId?: string;
}

// Mock data for development purposes
const mockContainers: Container[] = [
  {
    id: "c001",
    name: "Container A",
    dimensions: { width: 10, height: 8, depth: 20 },
    capacity: 1600,
    currentLoad: 850,
    items: []
  },
  {
    id: "c002",
    name: "Container B",
    dimensions: { width: 12, height: 10, depth: 15 },
    capacity: 1800,
    currentLoad: 1200,
    items: []
  },
  {
    id: "c003",
    name: "Container C",
    dimensions: { width: 8, height: 6, depth: 12 },
    capacity: 576,
    currentLoad: 300,
    items: []
  }
];

const mockItems: Item[] = [
  {
    id: "i001",
    name: "Medical Supplies",
    dimensions: { width: 2, height: 1, depth: 3 },
    weight: 5,
    priority: "high",
    containerId: "c001",
    position: { x: 0, y: 0, z: 0 },
    category: "Medical"
  },
  {
    id: "i002",
    name: "Food Rations",
    dimensions: { width: 4, height: 2, depth: 3 },
    weight: 10,
    priority: "high",
    containerId: "c001",
    position: { x: 2, y: 0, z: 0 },
    category: "Food",
    expiryDate: "2025-06-01"
  },
  {
    id: "i003",
    name: "Scientific Equipment",
    dimensions: { width: 3, height: 3, depth: 4 },
    weight: 15,
    priority: "medium",
    containerId: "c002",
    position: { x: 0, y: 0, z: 3 },
    category: "Science"
  },
  {
    id: "i004",
    name: "Maintenance Tools",
    dimensions: { width: 2, height: 1, depth: 2 },
    weight: 8,
    priority: "medium",
    containerId: "c002",
    position: { x: 3, y: 0, z: 3 },
    category: "Maintenance"
  },
  {
    id: "i005",
    name: "Personal Items",
    dimensions: { width: 1, height: 1, depth: 1 },
    weight: 2,
    priority: "low",
    containerId: "c003",
    position: { x: 0, y: 0, z: 7 },
    category: "Personal"
  },
  {
    id: "i006",
    name: "Waste Package",
    dimensions: { width: 1, height: 1, depth: 1 },
    weight: 3,
    priority: "low",
    containerId: "c003",
    position: { x: 1, y: 0, z: 7 },
    category: "Waste",
    isWaste: true
  }
];

const mockLogs: LogEntry[] = [
  {
    id: "l001",
    timestamp: "2025-04-06T09:30:00Z",
    operation: "ITEM_PLACED",
    details: {
      itemId: "i001",
      containerId: "c001",
      position: { x: 0, y: 0, z: 0 }
    }
  },
  {
    id: "l002",
    timestamp: "2025-04-06T10:15:00Z",
    operation: "ITEM_PLACED",
    details: {
      itemId: "i002",
      containerId: "c001",
      position: { x: 2, y: 0, z: 0 }
    }
  },
  {
    id: "l003",
    timestamp: "2025-04-06T11:45:00Z",
    operation: "ITEM_RETRIEVED",
    details: {
      itemId: "i001",
      containerId: "c001"
    }
  },
  {
    id: "l004",
    timestamp: "2025-04-06T13:20:00Z",
    operation: "ITEM_PLACED",
    details: {
      itemId: "i001",
      containerId: "c001",
      position: { x: 0, y: 0, z: 0 }
    }
  }
];

// API functions that would normally connect to a backend

// Get all containers
export async function getContainers(): Promise<Container[]> {
  // In a real app, this would be:
  // return apiRequest<Container[]>('/containers');
  
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockContainers), 300);
  });
}

// Get container by ID
export async function getContainerById(id: string): Promise<Container> {
  // In a real app, this would be:
  // return apiRequest<Container>(`/containers/${id}`);
  
  // For now, we'll return mock data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const container = mockContainers.find(c => c.id === id);
      if (container) {
        // Add items to the container
        const containerItems = mockItems.filter(item => item.containerId === id);
        resolve({
          ...container,
          items: containerItems
        });
      } else {
        reject(new Error("Container not found"));
      }
    }, 300);
  });
}

// Get placement recommendations
export async function getPlacementRecommendations(
  itemId: string
): Promise<PlacementRecommendation[]> {
  // In a real app, this would be:
  // return apiRequest<PlacementRecommendation[]>(`/placement?itemId=${itemId}`);
  
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simple algorithm - recommend containers with the most space
      const recommendations = mockContainers
        .sort((a, b) => (a.currentLoad / a.capacity) - (b.currentLoad / b.capacity))
        .slice(0, 2)
        .map((container, index) => ({
          itemId,
          containerId: container.id,
          position: { x: index, y: 0, z: index },
          priorityScore: 100 - ((container.currentLoad / container.capacity) * 100),
          reasonings: [
            "Container has available space",
            "Placement optimizes for future retrievals",
            "Position minimizes rearrangement needs"
          ]
        }));
      
      resolve(recommendations);
    }, 500);
  });
}

// Search for items
export async function searchItems(
  query: string, 
  filters?: { 
    category?: string; 
    priority?: "high" | "medium" | "low"; 
    isWaste?: boolean 
  }
): Promise<SearchResult> {
  // In a real app, this would be:
  // return apiRequest<SearchResult>(`/search?query=${encodeURIComponent(query)}&${new URLSearchParams(filters)}`);
  
  // For now, we'll return filtered mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredItems = [...mockItems];
      
      // Apply text search
      if (query) {
        const queryLower = query.toLowerCase();
        filteredItems = filteredItems.filter(
          item => item.name.toLowerCase().includes(queryLower) || 
                 item.category.toLowerCase().includes(queryLower)
        );
      }
      
      // Apply filters
      if (filters) {
        if (filters.category) {
          filteredItems = filteredItems.filter(
            item => item.category.toLowerCase() === filters.category?.toLowerCase()
          );
        }
        
        if (filters.priority) {
          filteredItems = filteredItems.filter(
            item => item.priority === filters.priority
          );
        }
        
        if (filters.isWaste !== undefined) {
          filteredItems = filteredItems.filter(
            item => item.isWaste === filters.isWaste
          );
        }
      }
      
      resolve({
        items: filteredItems,
        totalResults: filteredItems.length
      });
    }, 300);
  });
}

// Get logs
export async function getLogs(limit: number = 10): Promise<LogEntry[]> {
  // In a real app, this would be:
  // return apiRequest<LogEntry[]>(`/logs?limit=${limit}`);
  
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLogs.slice(0, limit));
    }, 300);
  });
}

// Identify waste items
export async function identifyWasteItems(): Promise<WasteItem[]> {
  // In a real app, this would be:
  // return apiRequest<WasteItem[]>('/waste/identify');
  
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      const wasteItems = mockItems.filter(item => item.isWaste) as WasteItem[];
      resolve(wasteItems);
    }, 300);
  });
}

// Simulate day
export async function simulateDay(): Promise<{ 
  success: boolean; 
  changes: Array<{ type: string; details: any }>
}> {
  // In a real app, this would be:
  // return apiRequest<{ success: boolean; changes: Array<{ type: string; details: any }> }>('/simulate/day', { method: 'POST' });
  
  // For now, we'll return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        changes: [
          {
            type: "ITEM_EXPIRY",
            details: {
              itemId: "i002",
              name: "Food Rations",
              expiryDate: "2025-05-01"
            }
          },
          {
            type: "WASTE_ADDED",
            details: {
              itemId: "i007",
              name: "New Waste Package",
              category: "Waste"
            }
          }
        ]
      });
    }, 1000);
  });
}

// Place item
export async function placeItem(
  itemId: string, 
  containerId: string, 
  position: { x: number; y: number; z: number }
): Promise<{ success: boolean }> {
  // In a real app, this would be:
  // return apiRequest<{ success: boolean }>('/place', {
  //   method: 'POST',
  //   body: JSON.stringify({ itemId, containerId, position })
  // });
  
  // For now, we'll return mock success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}

// Retrieve item
export async function retrieveItem(
  itemId: string
): Promise<{ success: boolean; rearrangements?: Array<{ itemId: string; newPosition: { x: number; y: number; z: number } }> }> {
  // In a real app, this would be:
  // return apiRequest<{ success: boolean; rearrangements?: Array<{ itemId: string; newPosition: { x: number; y: number; z: number } }> }>(`/retrieve/${itemId}`, { method: 'POST' });
  
  // For now, we'll return mock success
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        success: true,
        rearrangements: [
          {
            itemId: "i003",
            newPosition: { x: 2, y: 0, z: 3 }
          }
        ]
      });
    }, 500);
  });
}
