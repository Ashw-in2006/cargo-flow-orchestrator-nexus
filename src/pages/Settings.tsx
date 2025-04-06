
import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Upload, Download, Database, Moon, Sun, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));
  const [importFile, setImportFile] = useState<File | null>(null);
  
  const handleDarkModeToggle = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setDarkMode(!darkMode);
    toast.success(`Theme switched to ${!darkMode ? 'dark' : 'light'} mode`);
  };
  
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
    }
  };
  
  const handleImport = () => {
    if (!importFile) {
      toast.error('Please select a file to import');
      return;
    }
    
    toast.success(`File "${importFile.name}" imported successfully`);
    setImportFile(null);
  };
  
  const handleExport = () => {
    toast.success('Data exported successfully');
  };
  
  const handleClearImportFile = () => {
    setImportFile(null);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure application settings and preferences</p>
      </div>
      
      <Tabs defaultValue="general" className="mb-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="importExport">Import/Export</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle between light and dark themes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4" />
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode} 
                    onCheckedChange={handleDarkModeToggle} 
                  />
                  <Moon className="h-4 w-4" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts about important system events
                  </p>
                </div>
                <Switch id="notifications" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-save">Auto-Save</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save changes
                  </p>
                </div>
                <Switch id="auto-save" defaultChecked />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-url">API Endpoint URL</Label>
                <Input id="api-url" defaultValue="http://localhost:8000/api" />
                <p className="text-xs text-muted-foreground">
                  The base URL for API requests
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="importExport" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Import/Export Data
              </CardTitle>
              <CardDescription>
                Manage your cargo system data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Import Data</Label>
                <div className="flex items-center gap-2">
                  {importFile ? (
                    <div className="flex-1 p-2 border rounded-md flex items-center justify-between">
                      <span className="text-sm truncate">{importFile.name}</span>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={handleClearImportFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <label 
                        htmlFor="import-file" 
                        className="cursor-pointer border border-dashed rounded-md p-6 flex flex-col items-center justify-center"
                      >
                        <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium">Click to select file</p>
                        <p className="text-xs text-muted-foreground mt-1">or drag and drop</p>
                      </label>
                      <input 
                        id="import-file" 
                        type="file" 
                        className="hidden" 
                        accept=".json,.csv"
                        onChange={handleImportFileChange}
                      />
                    </div>
                  )}
                  <Button 
                    onClick={handleImport}
                    disabled={!importFile}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Import cargo data from CSV or JSON files
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Export Data</Label>
                <div className="flex items-center gap-2">
                  <Select defaultValue="json">
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON Format</SelectItem>
                      <SelectItem value="csv">CSV Format</SelectItem>
                      <SelectItem value="xml">XML Format</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Export your cargo system data for backup or analysis
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Data Management</Label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className="flex-1">Backup Data</Button>
                  <Button variant="destructive" className="flex-1">Reset Data</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Create backups or reset your system data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="admin" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" defaultValue="admin@example.com" type="email" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value="********" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Account Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

function Select({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) {
  return (
    <div className="relative">
      <select className="w-full p-2 border rounded-md appearance-none" defaultValue={defaultValue}>
        {children}
      </select>
    </div>
  );
}

function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}

function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

function SelectValue({ placeholder }: { placeholder: string }) {
  return <span>{placeholder}</span>;
}

export default Settings;
