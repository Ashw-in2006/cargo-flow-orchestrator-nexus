
import React, { useState, useEffect } from 'react';
import { Trash2, PackageCheck, Truck, ArrowRightCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { identifyWasteItems, WasteItem } from '@/services/api';
import { toast } from 'sonner';

const Waste = () => {
  const [wasteItems, setWasteItems] = useState<WasteItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingStep, setProcessingStep] = useState<number | null>(null);

  useEffect(() => {
    const loadWasteItems = async () => {
      setLoading(true);
      try {
        const items = await identifyWasteItems();
        setWasteItems(items);
      } catch (error) {
        console.error('Error loading waste items:', error);
        toast.error('Failed to load waste items');
      } finally {
        setLoading(false);
      }
    };
    
    loadWasteItems();
  }, []);

  const handleSelectAll = () => {
    if (selectedItems.length === wasteItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wasteItems.map(item => item.id));
    }
  };

  const handleSelectItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleProcessWaste = () => {
    if (selectedItems.length === 0) {
      toast.warning('Please select at least one waste item to process');
      return;
    }
    
    setProcessingStep(1);
    
    // Simulate processing steps
    const interval = setInterval(() => {
      setProcessingStep(prevStep => {
        if (prevStep === 4) {
          clearInterval(interval);
          toast.success('Waste items processed successfully');
          // Remove processed items from the list
          setWasteItems(wasteItems.filter(item => !selectedItems.includes(item.id)));
          setSelectedItems([]);
          return null;
        }
        return (prevStep || 0) + 1;
      });
    }, 1500);
  };

  const getStepLabel = (step: number) => {
    switch (step) {
      case 1: return 'Collecting waste items...';
      case 2: return 'Preparing for return...';
      case 3: return 'Loading onto return vessel...';
      case 4: return 'Completing undocking procedure...';
      default: return '';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Waste Management</h1>
        <p className="text-muted-foreground">Process and return waste items safely</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Identified Waste Items
              </CardTitle>
              <CardDescription>
                Select items to process for return to Earth
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Scanning for waste items...
                </div>
              ) : wasteItems.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <PackageCheck className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No waste items identified</p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Button variant="outline" size="sm" onClick={handleSelectAll}>
                      {selectedItems.length === wasteItems.length ? 'Deselect All' : 'Select All'}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {selectedItems.length} of {wasteItems.length} selected
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {wasteItems.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-4 border rounded-md flex items-center gap-3 cursor-pointer ${
                          selectedItems.includes(item.id) ? 'bg-primary/10 border-primary/30' : ''
                        }`}
                        onClick={() => handleSelectItem(item.id)}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="h-5 w-5"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span>Category: {item.category}</span>
                            <span>Weight: {item.weight} kg</span>
                            <span>Container: {item.containerId}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleProcessWaste} 
                disabled={loading || wasteItems.length === 0 || selectedItems.length === 0 || processingStep !== null}
                className="w-full"
              >
                <Truck className="h-4 w-4 mr-2" />
                Process Selected Waste Items
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRightCircle className="h-5 w-5" />
                Processing Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {processingStep === null ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Truck className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Select and process waste items to begin</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Processing waste return</span>
                      <span className="text-sm font-medium">{processingStep * 25}%</span>
                    </div>
                    <Progress value={processingStep * 25} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map(step => (
                      <div key={step} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          processingStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {processingStep > step ? '✓' : step}
                        </div>
                        <span className={`text-sm ${
                          processingStep === step ? 'font-medium' : (processingStep > step ? 'text-muted-foreground line-through' : 'text-muted-foreground')
                        }`}>
                          {getStepLabel(step)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Processing {selectedItems.length} waste items weighing approximately {wasteItems
                        .filter(item => selectedItems.includes(item.id))
                        .reduce((total, item) => total + item.weight, 0)} kg
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Waste;
