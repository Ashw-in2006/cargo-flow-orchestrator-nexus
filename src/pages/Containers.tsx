
import React, { useState, useEffect } from 'react';
import { Boxes, Box, Plus, Edit, Trash } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getContainers, getContainerById, Container } from '@/services/api';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContainerVisualization from '@/components/ContainerVisualization';

const Containers = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [loading, setLoading] = useState(true);

  const loadContainers = async () => {
    setLoading(true);
    try {
      const containersData = await getContainers();
      setContainers(containersData);
    } catch (error) {
      console.error('Error loading containers:', error);
      toast.error('Failed to load containers');
    } finally {
      setLoading(false);
    }
  };

  const loadContainerDetails = async (containerId: string) => {
    try {
      const containerData = await getContainerById(containerId);
      setSelectedContainer(containerData);
    } catch (error) {
      console.error('Error loading container details:', error);
      toast.error('Failed to load container details');
    }
  };

  useEffect(() => {
    loadContainers();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Container Management</h1>
        <p className="text-muted-foreground">View and manage your storage containers</p>
      </div>
      
      <div className="flex justify-end mb-4">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Container
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Boxes className="h-5 w-5" />
                Containers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4 text-muted-foreground">
                  Loading containers...
                </div>
              ) : containers.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No containers found
                </div>
              ) : (
                <div className="space-y-2">
                  {containers.map((container) => (
                    <div
                      key={container.id}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${selectedContainer?.id === container.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-accent'}`}
                      onClick={() => loadContainerDetails(container.id)}
                    >
                      <div className="flex items-center gap-2">
                        <Box className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{container.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {container.currentLoad}/{container.capacity} units ({Math.round((container.currentLoad / container.capacity) * 100)}% full)
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {selectedContainer ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    {selectedContainer.name}
                  </span>
                  <span className="text-sm font-normal">
                    ID: {selectedContainer.id}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="items">Items</TabsTrigger>
                    <TabsTrigger value="visualization">Visualization</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Dimensions</p>
                        <p className="text-muted-foreground">
                          {selectedContainer.dimensions.width} × {selectedContainer.dimensions.height} × {selectedContainer.dimensions.depth} units
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Capacity</p>
                        <p className="text-muted-foreground">
                          {selectedContainer.capacity} units
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Current Load</p>
                        <p className="text-muted-foreground">
                          {selectedContainer.currentLoad} units ({Math.round((selectedContainer.currentLoad / selectedContainer.capacity) * 100)}% full)
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Available Space</p>
                        <p className="text-muted-foreground">
                          {selectedContainer.capacity - selectedContainer.currentLoad} units
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="items" className="mt-4">
                    {selectedContainer.items.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        No items in this container
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedContainer.items.map((item) => (
                          <div key={item.id} className="p-3 border rounded-md">
                            <div className="flex justify-between">
                              <p className="font-medium">{item.name}</p>
                              <p className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                                {item.priority}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Category: {item.category}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Position: X{item.position?.x}, Y{item.position?.y}, Z{item.position?.z}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="visualization" className="mt-4">
                    <div className="border rounded-md p-4 h-80 bg-slate-50 dark:bg-slate-900">
                      <ContainerVisualization container={selectedContainer} />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                <Boxes className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Select a container to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Containers;
