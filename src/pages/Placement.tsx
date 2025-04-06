
import React, { useState, useEffect } from 'react';
import { Package, PackagePlus, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getContainers, getPlacementRecommendations, placeItem, Container, PlacementRecommendation } from '@/services/api';
import { toast } from 'sonner';

const Placement = () => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedItemId, setSelectedItemId] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemPriority, setItemPriority] = useState('medium');
  const [itemWidth, setItemWidth] = useState('1');
  const [itemHeight, setItemHeight] = useState('1');
  const [itemDepth, setItemDepth] = useState('1');
  const [itemWeight, setItemWeight] = useState('1');
  const [recommendations, setRecommendations] = useState<PlacementRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadContainers = async () => {
      try {
        const containersData = await getContainers();
        setContainers(containersData);
      } catch (error) {
        console.error('Error loading containers:', error);
        toast.error('Failed to load containers');
      }
    };
    
    loadContainers();
  }, []);

  const handleGetRecommendations = async () => {
    setLoading(true);
    try {
      // In a real app, we would create the item first, then get recommendations
      // For now, we'll just use a mock item ID
      const mockItemId = 'item1';
      const recommendations = await getPlacementRecommendations(mockItemId);
      setRecommendations(recommendations);
      setSelectedItemId(mockItemId);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      toast.error('Failed to get placement recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceItem = async (recommendation: PlacementRecommendation) => {
    try {
      await placeItem(
        recommendation.itemId,
        recommendation.containerId,
        recommendation.position
      );
      toast.success('Item placed successfully');
      // Reset form
      setItemName('');
      setItemCategory('');
      setItemPriority('medium');
      setItemWidth('1');
      setItemHeight('1');
      setItemDepth('1');
      setItemWeight('1');
      setRecommendations([]);
    } catch (error) {
      console.error('Error placing item:', error);
      toast.error('Failed to place item');
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Cargo Placement</h1>
        <p className="text-muted-foreground">Optimize cargo placement based on our algorithms</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5" />
              New Item Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input
                    id="name"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Enter item name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    placeholder="E.g., Medical, Food, Equipment"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={itemPriority} onValueChange={setItemPriority}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      value={itemWidth}
                      onChange={(e) => setItemWidth(e.target.value)}
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={itemHeight}
                      onChange={(e) => setItemHeight(e.target.value)}
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depth">Depth</Label>
                    <Input
                      id="depth"
                      value={itemDepth}
                      onChange={(e) => setItemDepth(e.target.value)}
                      type="number"
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    value={itemWeight}
                    onChange={(e) => setItemWeight(e.target.value)}
                    type="number"
                    min="1"
                  />
                </div>
                
                <Button 
                  type="button" 
                  onClick={handleGetRecommendations}
                  disabled={loading || !itemName || !itemCategory}
                  className="w-full mt-4"
                >
                  Get Placement Recommendations
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Placement Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recommendations.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {loading ? (
                  <p>Calculating optimal placement...</p>
                ) : (
                  <p>Enter item details and click "Get Placement Recommendations"</p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => {
                  const container = containers.find(c => c.id === recommendation.containerId);
                  return (
                    <Card key={index} className="border-2 border-primary/20 hover:border-primary/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">{container?.name || recommendation.containerId}</p>
                            <p className="text-sm text-muted-foreground">
                              Position: X{recommendation.position.x}, Y{recommendation.position.y}, Z{recommendation.position.z}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Score: {recommendation.priorityScore.toFixed(1)}
                            </p>
                          </div>
                          <Button onClick={() => handlePlaceItem(recommendation)}>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Place Here
                          </Button>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium">Reasoning:</p>
                          <ul className="text-sm text-muted-foreground list-disc pl-5 mt-1">
                            {recommendation.reasonings.map((reason, idx) => (
                              <li key={idx}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Placement;
