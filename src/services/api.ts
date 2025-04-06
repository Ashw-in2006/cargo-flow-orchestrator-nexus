
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

// API Endpoints

// Get all containers
export async function getContainers(): Promise<Container[]> {
  return apiRequest<Container[]>('/containers');
}

// Get container by ID
export async function getContainerById(id: string): Promise<Container> {
  return apiRequest<Container>(`/containers/${id}`);
}

// Get placement recommendations
export async function getPlacementRecommendations(
  itemId: string
): Promise<PlacementRecommendation[]> {
  return apiRequest<PlacementRecommendation[]>('/placement', {
    method: 'POST',
    body: JSON.stringify({ items: [itemId] })
  }).then(response => response.placements || []);
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
  const searchParams = new URLSearchParams();
  
  if (query) {
    searchParams.append('query', query);
  }
  
  if (filters) {
    if (filters.category) {
      searchParams.append('category', filters.category);
    }
    
    if (filters.priority) {
      searchParams.append('priority', filters.priority);
    }
    
    if (filters.isWaste !== undefined) {
      searchParams.append('isWaste', filters.isWaste.toString());
    }
  }
  
  return apiRequest<SearchResult>(`/search?${searchParams.toString()}`);
}

// Get logs
export async function getLogs(limit: number = 10): Promise<LogEntry[]> {
  return apiRequest<{ success: boolean, logs: LogEntry[] }>(`/logs?limit=${limit}`)
    .then(response => response.logs || []);
}

// Identify waste items
export async function identifyWasteItems(): Promise<WasteItem[]> {
  return apiRequest<{ success: boolean, items: WasteItem[] }>('/waste/identify')
    .then(response => response.items || []);
}

// Simulate day
export async function simulateDay(days: number = 1): Promise<{ 
  success: boolean; 
  changes: Array<{ type: string; details: any }>
}> {
  return apiRequest<{ 
    success: boolean; 
    changes: Array<{ type: string; details: any }> 
  }>('/simulate/day', { 
    method: 'POST',
    body: JSON.stringify({ days })
  });
}

// Place item
export async function placeItem(
  itemId: string, 
  containerId: string, 
  position: { x: number; y: number; z: number }
): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>('/place', {
    method: 'POST',
    body: JSON.stringify({ itemId, containerId, position })
  });
}

// Retrieve item
export async function retrieveItem(
  itemId: string
): Promise<{ success: boolean; rearrangements?: Array<{ itemId: string; newPosition: { x: number; y: number; z: number } }> }> {
  return apiRequest<{ 
    success: boolean; 
    rearrangements?: Array<{ 
      itemId: string; 
      newPosition: { x: number; y: number; z: number } 
    }> 
  }>('/retrieve', { 
    method: 'POST',
    body: JSON.stringify({ itemId })
  });
}

// Export current arrangement
export async function exportArrangement(): Promise<any> {
  return apiRequest<any>('/export/arrangement');
}

// Import items
export async function importItems(items: Partial<Item>[]): Promise<{ success: boolean; count: number }> {
  return apiRequest<{ success: boolean; count: number }>('/import/items', {
    method: 'POST',
    body: JSON.stringify({ items })
  });
}

// Import containers
export async function importContainers(containers: Partial<Container>[]): Promise<{ success: boolean; count: number }> {
  return apiRequest<{ success: boolean; count: number }>('/import/containers', {
    method: 'POST',
    body: JSON.stringify({ containers })
  });
}

// Waste management - get return plan
export async function getWasteReturnPlan(itemIds: string[]): Promise<any> {
  return apiRequest<any>('/waste/return-plan', {
    method: 'POST',
    body: JSON.stringify({ itemIds })
  });
}

// Waste management - complete undocking
export async function completeWasteUndocking(operationId: string): Promise<{ success: boolean }> {
  return apiRequest<{ success: boolean }>('/waste/complete-undocking', {
    method: 'POST',
    body: JSON.stringify({ operationId })
  });
}

// Analytics data functions
export async function getAnalyticsData(): Promise<{
  spaceUtilization: { percentage: number; trend: number };
  itemCounts: { priority: string; count: number }[];
  wasteGeneration: { period: string; amount: number }[];
  categoryDistribution: { name: string; value: number }[];
  containerCapacity: { name: string; capacity: number; used: number }[];
}> {
  // In a real app, this would be an API call
  return {
    spaceUtilization: { percentage: 74.3, trend: 5.2 },
    itemCounts: [
      { priority: 'High', count: 12 },
      { priority: 'Medium', count: 25 },
      { priority: 'Low', count: 18 },
    ],
    wasteGeneration: [
      { period: 'Week 1', amount: 5 },
      { period: 'Week 2', amount: 7 },
      { period: 'Week 3', amount: 3 },
      { period: 'Week 4', amount: 9 },
    ],
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
    ],
  };
}
