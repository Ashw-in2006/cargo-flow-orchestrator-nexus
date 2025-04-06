
import React from 'react';
import { LogEntry } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LogDisplayProps {
  logs: LogEntry[];
  title?: string;
  maxHeight?: number;
}

const LogDisplay: React.FC<LogDisplayProps> = ({ 
  logs, 
  title = "Recent Activity", 
  maxHeight = 300 
}) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getOperationText = (log: LogEntry) => {
    switch (log.operation) {
      case 'ITEM_PLACED':
        return `Item ${log.details.itemId} placed in container ${log.details.containerId}`;
      case 'ITEM_RETRIEVED':
        return `Item ${log.details.itemId} retrieved from container ${log.details.containerId}`;
      case 'CONTAINER_ADDED':
        return `New container ${log.details.containerId} added`;
      case 'ITEM_REARRANGED':
        return `Item ${log.details.itemId} rearranged within container ${log.details.containerId}`;
      case 'WASTE_IDENTIFIED':
        return `Waste item ${log.details.itemId} identified`;
      case 'DAY_SIMULATED':
        return `Day simulation completed (${log.details.changes || 0} changes)`;
      default:
        return `${log.operation}: ${JSON.stringify(log.details)}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className={`max-h-[${maxHeight}px]`}>
          {logs.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No activity recorded
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="font-medium">{getOperationText(log)}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatTimestamp(log.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LogDisplay;
