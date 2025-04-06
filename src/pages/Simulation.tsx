
import React, { useState } from 'react';
import { Clock, FastForward, Calendar, AlertTriangle, RotateCcw } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { simulateDay } from '@/services/api';
import { toast } from 'sonner';

const Simulation = () => {
  const [days, setDays] = useState('1');
  const [simulating, setSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{
    success: boolean;
    changes: Array<{ type: string; details: any }>;
  } | null>(null);
  const [simulatedDate, setSimulatedDate] = useState<Date>(new Date());

  const handleSimulate = async () => {
    const daysToSimulate = parseInt(days);
    if (isNaN(daysToSimulate) || daysToSimulate < 1) {
      toast.error('Please enter a valid number of days');
      return;
    }
    
    setSimulating(true);
    try {
      const results = await simulateDay();
      setSimulationResults(results);
      
      // Update simulated date
      const newDate = new Date(simulatedDate);
      newDate.setDate(newDate.getDate() + daysToSimulate);
      setSimulatedDate(newDate);
      
      toast.success(`Successfully simulated ${daysToSimulate} day(s)`);
    } catch (error) {
      console.error('Error simulating days:', error);
      toast.error('Failed to simulate time passage');
    } finally {
      setSimulating(false);
    }
  };

  const resetSimulation = () => {
    setSimulationResults(null);
    setSimulatedDate(new Date());
    toast.info('Simulation reset to current date');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Time Simulation</h1>
        <p className="text-muted-foreground">Simulate the passage of time to anticipate future changes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FastForward className="h-5 w-5" />
              Simulate Time
            </CardTitle>
            <CardDescription>
              Fast-forward time to see how your cargo system will evolve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="days">Number of Days</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                  />
                  <Button onClick={handleSimulate} disabled={simulating}>
                    {simulating ? 'Simulating...' : 'Simulate'}
                  </Button>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Current Simulated Date</p>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>
                    {simulatedDate.toLocaleDateString(undefined, { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
              
              {simulationResults && (
                <Button 
                  variant="outline" 
                  onClick={resetSimulation} 
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Simulation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Simulation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!simulationResults ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Run a simulation to see results</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Events</h3>
                    {simulationResults.changes.length === 0 ? (
                      <p className="text-muted-foreground">No significant events occurred during this period</p>
                    ) : (
                      <div className="space-y-2">
                        {simulationResults.changes.map((change, index) => {
                          const getIcon = () => {
                            switch (change.type) {
                              case 'ITEM_EXPIRY': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
                              case 'WASTE_ADDED': return <Trash2 className="h-4 w-4 text-purple-500" />;
                              default: return <Clock className="h-4 w-4 text-blue-500" />;
                            }
                          };
                          
                          return (
                            <div key={index} className="p-3 border rounded-md">
                              <div className="flex items-center gap-2">
                                {getIcon()}
                                <span className="font-medium">{change.type.replace(/_/g, ' ')}</span>
                              </div>
                              <div className="mt-1 text-sm text-muted-foreground">
                                {change.type === 'ITEM_EXPIRY' && (
                                  <p>Item "{change.details.name}" will expire on {new Date(change.details.expiryDate).toLocaleDateString()}</p>
                                )}
                                {change.type === 'WASTE_ADDED' && (
                                  <p>New waste item "{change.details.name}" has been identified</p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Simulations help predict future cargo needs and waste management requirements
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Simulation;

function Trash2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  );
}
