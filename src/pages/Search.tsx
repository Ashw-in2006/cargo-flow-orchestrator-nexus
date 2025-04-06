
import React, { useState } from 'react';
import { Search as SearchIcon, Package, ArrowDownCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { searchItems, retrieveItem, Item } from '@/services/api';
import ItemList from '@/components/ItemList';
import { toast } from 'sonner';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [retrievingItemId, setRetrievingItemId] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const filters: { category?: string; priority?: 'high' | 'medium' | 'low' } = {};
      
      if (categoryFilter) {
        filters.category = categoryFilter;
      }
      
      if (priorityFilter) {
        filters.priority = priorityFilter as 'high' | 'medium' | 'low';
      }
      
      const result = await searchItems(searchQuery, filters);
      setSearchResults(result.items);
      
      if (result.items.length === 0) {
        toast.info('No items found matching your search criteria');
      }
    } catch (error) {
      console.error('Error searching items:', error);
      toast.error('Failed to search items');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrieve = async (item: Item) => {
    setRetrievingItemId(item.id);
    try {
      const result = await retrieveItem(item.id);
      if (result.success) {
        toast.success(`Item "${item.name}" retrieved successfully`);
        if (result.rearrangements && result.rearrangements.length > 0) {
          toast.info(`${result.rearrangements.length} items had to be rearranged to retrieve this item`);
        }
      }
    } catch (error) {
      console.error('Error retrieving item:', error);
      toast.error(`Failed to retrieve item "${item.name}"`);
    } finally {
      setRetrievingItemId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Search & Retrieve</h1>
        <p className="text-muted-foreground">Search for items and retrieve them from storage</p>
      </div>
      
      <Tabs defaultValue="search" className="mb-6">
        <TabsList>
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="retrieve">Retrieve</TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                Search Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="search">Search Query</Label>
                  <Input
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter item name or description"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="Medical">Medical</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Waste">Waste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="md:col-span-4">
                  <Button 
                    onClick={handleSearch} 
                    disabled={loading}
                    className="w-full"
                  >
                    <SearchIcon className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <ItemList 
              title="Search Results" 
              items={searchResults}
              actions={(item) => (
                <Button 
                  onClick={() => handleRetrieve(item)}
                  disabled={retrievingItemId === item.id}
                  variant="outline" 
                  size="sm"
                >
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                  Retrieve
                </Button>
              )}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="retrieve" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Retrieve by ID
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="itemId">Item ID</Label>
                  <Input
                    id="itemId"
                    placeholder="Enter item ID"
                    className="mt-1"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button className="w-full">
                    <ArrowDownCircle className="h-4 w-4 mr-2" />
                    Retrieve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SearchPage;
