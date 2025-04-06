
import React from 'react';
import { BarChart3, PieChart, LineChart, ArrowUpRight, TrendingUp, BarChart, ListFilter, Package, Trash2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, BarChart as RechartBar, Bar, PieChart as RechartPie, Pie, LineChart as RechartLine, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data for charts
const usageData = [
  { name: 'Jan', usage: 65 },
  { name: 'Feb', usage: 59 },
  { name: 'Mar', usage: 80 },
  { name: 'Apr', usage: 81 },
  { name: 'May', usage: 56 },
  { name: 'Jun', usage: 55 },
];

const containerData = [
  { name: 'Container A', capacity: 1600, used: 1200 },
  { name: 'Container B', capacity: 1800, used: 900 },
  { name: 'Container C', capacity: 576, used: 400 },
];

const categoryDistribution = [
  { name: 'Medical', value: 25 },
  { name: 'Food', value: 30 },
  { name: 'Science', value: 15 },
  { name: 'Maintenance', value: 20 },
  { name: 'Personal', value: 10 },
];

const priorityData = [
  { name: 'High', count: 12 },
  { name: 'Medium', count: 25 },
  { name: 'Low', count: 18 },
];

const wasteData = [
  { name: 'Week 1', amount: 5 },
  { name: 'Week 2', amount: 7 },
  { name: 'Week 3', amount: 3 },
  { name: 'Week 4', amount: 9 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground">Insights and statistics about your cargo system</p>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="containers">Containers</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="waste">Waste</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Button variant="outline" size="sm">
          <ListFilter className="h-4 w-4 mr-2" />
          Filter Data
        </Button>
      </div>
      
      <TabsContent value="overview" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Space Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">74.3%</div>
              <p className="text-xs text-muted-foreground">+5.2% from last month</p>
              <div className="h-[80px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="usage" stroke="#0088FE" fillOpacity={1} fill="url(#colorUsage)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Item Count by Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">55 Items</div>
              <p className="text-xs text-muted-foreground">12 high priority items</p>
              <div className="h-[80px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Waste Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.2 kg/week</div>
              <p className="text-xs text-muted-foreground text-red-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last week
              </p>
              <div className="h-[80px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wasteData}>
                    <Line type="monotone" dataKey="amount" stroke="#FF8042" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Item Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartPie>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </RechartPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Container Capacity Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartBar
                    data={containerData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="capacity" fill="#8884d8" name="Total Capacity" />
                    <Bar dataKey="used" fill="#82ca9d" name="Used Space" />
                  </RechartBar>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="containers" className="mt-0">
        {/* Container analytics content */}
        <div className="p-12 text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Container analytics would be displayed here</p>
        </div>
      </TabsContent>
      
      <TabsContent value="items" className="mt-0">
        {/* Item analytics content */}
        <div className="p-12 text-center text-muted-foreground">
          <Package className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Item analytics would be displayed here</p>
        </div>
      </TabsContent>
      
      <TabsContent value="waste" className="mt-0">
        {/* Waste analytics content */}
        <div className="p-12 text-center text-muted-foreground">
          <Trash2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p>Waste analytics would be displayed here</p>
        </div>
      </TabsContent>
    </DashboardLayout>
  );
};

export default Analytics;
