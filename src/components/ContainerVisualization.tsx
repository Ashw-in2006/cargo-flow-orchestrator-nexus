
import React, { useRef, useEffect } from 'react';
import { Container, Item } from '@/services/api';
import { Card } from '@/components/ui/card';

interface ContainerVisualizationProps {
  container: Container;
}

const ContainerVisualization: React.FC<ContainerVisualizationProps> = ({ container }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high':
        return '#EF4444'; // Red
      case 'medium':
        return '#F59E0B'; // Orange
      case 'low':
        return '#10B981'; // Green
      default:
        return '#64748B'; // Gray
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw container
    const scale = Math.min(
      canvas.width / container.dimensions.width,
      canvas.height / container.dimensions.height
    ) * 0.8;

    const containerWidth = container.dimensions.width * scale;
    const containerHeight = container.dimensions.height * scale;
    const containerDepth = container.dimensions.depth * scale * 0.3; // Scale depth for visualization

    const startX = (canvas.width - containerWidth) / 2;
    const startY = (canvas.height - containerHeight) / 2;

    // Draw container outline (3D effect)
    // Front face
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(startX, startY, containerWidth, containerHeight);
    ctx.stroke();
    
    // Top line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + containerDepth * 0.5, startY - containerDepth * 0.5);
    ctx.stroke();
    
    // Right line
    ctx.beginPath();
    ctx.moveTo(startX + containerWidth, startY);
    ctx.lineTo(startX + containerWidth + containerDepth * 0.5, startY - containerDepth * 0.5);
    ctx.stroke();
    
    // Top face
    ctx.beginPath();
    ctx.moveTo(startX + containerDepth * 0.5, startY - containerDepth * 0.5);
    ctx.lineTo(startX + containerWidth + containerDepth * 0.5, startY - containerDepth * 0.5);
    ctx.lineTo(startX + containerWidth, startY);
    ctx.stroke();
    
    // Background lines - dashed
    ctx.setLineDash([5, 5]);
    
    // Left back vertical
    ctx.beginPath();
    ctx.moveTo(startX + containerDepth * 0.5, startY - containerDepth * 0.5);
    ctx.lineTo(startX + containerDepth * 0.5, startY + containerHeight - containerDepth * 0.5);
    ctx.stroke();
    
    // Bottom back horizontal
    ctx.beginPath();
    ctx.moveTo(startX + containerDepth * 0.5, startY + containerHeight - containerDepth * 0.5);
    ctx.lineTo(startX + containerWidth + containerDepth * 0.5, startY + containerHeight - containerDepth * 0.5);
    ctx.stroke();
    
    // Right back vertical
    ctx.beginPath();
    ctx.moveTo(startX + containerWidth + containerDepth * 0.5, startY - containerDepth * 0.5);
    ctx.lineTo(startX + containerWidth + containerDepth * 0.5, startY + containerHeight - containerDepth * 0.5);
    ctx.stroke();
    
    // Reset dashes
    ctx.setLineDash([]);

    // Draw items
    if (container.items && container.items.length > 0) {
      container.items.forEach(item => {
        if (!item.position) return;
        
        const itemX = startX + item.position.x * scale;
        const itemY = startY + item.position.y * scale;
        const itemZ = item.position.z * scale * 0.2; // Scale for visualization
        
        const itemWidth = item.dimensions.width * scale;
        const itemHeight = item.dimensions.height * scale;
        const itemDepth = item.dimensions.depth * scale * 0.3;
        
        // Draw item with 3D effect
        // Front face
        ctx.fillStyle = getPriorityColor(item.priority);
        ctx.fillRect(
          itemX - itemZ * 0.5, 
          itemY - itemZ * 0.5, 
          itemWidth, 
          itemHeight
        );
        
        // Top face
        ctx.fillStyle = adjustBrightness(getPriorityColor(item.priority), 1.3);
        ctx.beginPath();
        ctx.moveTo(itemX - itemZ * 0.5, itemY - itemZ * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemDepth * 0.5, itemY - itemZ * 0.5 - itemDepth * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth + itemDepth * 0.5, itemY - itemZ * 0.5 - itemDepth * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth, itemY - itemZ * 0.5);
        ctx.closePath();
        ctx.fill();
        
        // Right face
        ctx.fillStyle = adjustBrightness(getPriorityColor(item.priority), 0.7);
        ctx.beginPath();
        ctx.moveTo(itemX - itemZ * 0.5 + itemWidth, itemY - itemZ * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth + itemDepth * 0.5, itemY - itemZ * 0.5 - itemDepth * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth + itemDepth * 0.5, itemY - itemZ * 0.5 + itemHeight - itemDepth * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth, itemY - itemZ * 0.5 + itemHeight);
        ctx.closePath();
        ctx.fill();
        
        // Add outline
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        
        // Front outline
        ctx.strokeRect(
          itemX - itemZ * 0.5, 
          itemY - itemZ * 0.5, 
          itemWidth, 
          itemHeight
        );
        
        // Top outline
        ctx.beginPath();
        ctx.moveTo(itemX - itemZ * 0.5, itemY - itemZ * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemDepth * 0.5, itemY - itemZ * 0.5 - itemDepth * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth + itemDepth * 0.5, itemY - itemZ * 0.5 - itemDepth * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth, itemY - itemZ * 0.5);
        ctx.closePath();
        ctx.stroke();
        
        // Right outline
        ctx.beginPath();
        ctx.moveTo(itemX - itemZ * 0.5 + itemWidth, itemY - itemZ * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth + itemDepth * 0.5, itemY - itemZ * 0.5 - itemDepth * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth + itemDepth * 0.5, itemY - itemZ * 0.5 + itemHeight - itemDepth * 0.5);
        ctx.lineTo(itemX - itemZ * 0.5 + itemWidth, itemY - itemZ * 0.5 + itemHeight);
        ctx.stroke();
      });
    }

  }, [container]);

  // Helper function to adjust color brightness
  function adjustBrightness(hex: string, factor: number): string {
    hex = hex.replace(/^#/, '');
    
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    r = Math.min(255, Math.round(r * factor));
    g = Math.min(255, Math.round(g * factor));
    b = Math.min(255, Math.round(b * factor));
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-2">{container.name} Visualization</h3>
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="border rounded bg-slate-50 mx-auto"
          width={400}
          height={300}
        />
        <div className="absolute bottom-2 right-2 bg-white/80 p-1 rounded text-xs">
          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 bg-cargo-priority-high"></span>
            <span>High Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 bg-cargo-priority-medium"></span>
            <span>Medium Priority</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="block w-3 h-3 bg-cargo-priority-low"></span>
            <span>Low Priority</span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        Container dimensions: {container.dimensions.width}x{container.dimensions.height}x{container.dimensions.depth}
      </div>
      <div className="mt-1 text-sm">
        Capacity usage: <span className="font-medium">{Math.round((container.currentLoad / container.capacity) * 100)}%</span>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${(container.currentLoad / container.capacity) * 100}%` }}
          ></div>
        </div>
      </div>
    </Card>
  );
};

export default ContainerVisualization;
