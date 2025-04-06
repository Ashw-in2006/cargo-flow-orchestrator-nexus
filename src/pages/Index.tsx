
import React, { useEffect, useState } from 'react';
import { Warehouse, Package, AlertCircle, BarChart3, Truck, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { getContainers, searchItems, getLogs, Container, Item, LogEntry } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContainerVisualization from '@/components/ContainerVisualization';
import ItemList from '@/components/ItemList';
import LogDisplay from '@/components/LogDisplay';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const [containers, setContainers] = useState<Container[]>([]);
  const [highPriorityItems, setHighPriorityItems] = useState<Item[]>([]);
  const [wasteItems, setWasteItems] = useState<Item[]>([]);
  const [recentLogs, setRecentLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load containers
      const containersData = await getContainers();
      setContainers(containersData);
      
      // Load high priority items
      const highPriorityResult = await searchItems('', { priority: 'high' });
      setHighPriorityItems(highPriorityResult.items);
      
      // Load waste items
      const wasteResult = await searchItems('', { isWaste: true });
      setWasteItems(wasteResult.items);
      
      // Load recent logs
      const logsData = await getLogs(5);
      setRecentLogs(logsData);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate stats
  const totalItems = containers.reduce((sum, container) => sum + container.items.length, 0);
  const totalCapacity = containers.reduce((sum, container) => sum + container.capacity, 0);
  const totalUsed = containers.reduce((sum, container) => sum + container.currentLoad, 0);
  const capacityUtilization = totalCapacity > 0 ? Math.round((totalUsed / totalCapacity) * 100) : 0;
  
  // Navigation handlers
  const handleContainerClick = (container: Container) => {
    navigate('/containers');
  };
  
  const handleItemAction = (item: Item) => {
    navigate('/placement');
  };
  
  const handleProcessWaste = () => {
    navigate('/waste');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your cargo system</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard 
          title="Total Containers" 
          value={containers.length} 
          icon={<Warehouse className="w-5 h-5 text-primary" />}
          onClick={() => navigate('/containers')}
        />
        <StatCard 
          title="Total Items" 
          value={totalItems} 
          icon={<Box className="w-5 h-5 text-primary" />}
          onClick={() => navigate('/search')}
        />
        <StatCard 
          title="High Priority Items" 
          value={highPriorityItems.length} 
          icon={<AlertCircle className="w-5 h-5 text-primary" />}
          onClick={() => navigate('/search?priority=high')}
        />
        <StatCard 
          title="Capacity Utilization" 
          value={`${capacityUtilization}%`} 
          icon={<BarChart3 className="w-5 h-5 text-primary" />} 
          trend={{ value: 5.2, positive: true }}
          onClick={() => navigate('/analytics')}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Container Overview</span>
              <Button variant="outline" size="sm" onClick={() => navigate('/containers')}>
                View All Containers
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p>Loading containers...</p>
              ) : containers.length === 0 ? (
                <p>No containers found</p>
              ) : (
                containers.map(container => (
                  <div 
                    key={container.id}
                    onClick={() => handleContainerClick(container)}
                    className="cursor-pointer hover:scale-105 transition-transform"
                  >
                    <ContainerVisualization 
                      container={container} 
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ItemList 
            title="High Priority Items" 
            items={highPriorityItems} 
            actions={(item) => (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleItemAction(item)}
              >
                <Package className="h-4 w-4 mr-1" />
                Place
              </Button>
            )}
          />
        </div>
        
        <div>
          <LogDisplay logs={recentLogs} />
        </div>
      </div>
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Waste Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {wasteItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No waste items identified
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  {wasteItems.length} waste items identified for processing
                </p>
                <Button onClick={handleProcessWaste}>Process Waste Items</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Index;
