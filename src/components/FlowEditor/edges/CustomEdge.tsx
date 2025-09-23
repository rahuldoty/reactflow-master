import { memo, useState } from 'react';
import {
  EdgeProps,
  getBezierPath,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
  EdgeLabelRenderer,
  useReactFlow,
} from 'reactflow';
import { Button } from '@/components/ui/button';
import { X, Edit3 } from 'lucide-react';

interface CustomEdgeData {
  label?: string;
  edgeType?: 'bezier' | 'step' | 'smoothstep' | 'straight';
  animated?: boolean;
}

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<CustomEdgeData>) => {
  const { setEdges } = useReactFlow();
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [label, setLabel] = useState(data?.label || '');

  const edgeType = data?.edgeType || 'bezier';
  
  let edgePath = '';
  let labelX = 0;
  let labelY = 0;

  // Generate path based on edge type
  if (edgeType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
  } else if (edgeType === 'step') {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
      borderRadius: 0,
    });
  } else if (edgeType === 'smoothstep') {
    [edgePath, labelX, labelY] = getSmoothStepPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  } else {
    [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });
  }

  const handleDeleteEdge = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  const updateEdgeLabel = (newLabel: string) => {
    setEdges((edges) =>
      edges.map((edge) =>
        edge.id === id
          ? {
              ...edge,
              data: { ...edge.data, label: newLabel },
            }
          : edge
      )
    );
  };

  const handleLabelSubmit = () => {
    setIsEditingLabel(false);
    updateEdgeLabel(label);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      handleLabelSubmit();
    }
  };

  return (
    <>
      <path
        id={id}
        className={`react-flow__edge-path ${
          data?.animated ? 'animated' : ''
        } ${selected ? 'stroke-primary' : 'stroke-border'}`}
        d={edgePath}
        strokeWidth={selected ? 3 : 2}
        fill="none"
      />
      
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {/* Edge Controls */}
          {selected && (
            <div className="flex items-center gap-1 mb-1">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteEdge}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingLabel(!isEditingLabel)}
                className="h-6 w-6 p-0"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {/* Edge Label */}
          {(label || isEditingLabel) && (
            <div className="bg-background border border-border rounded px-2 py-1 shadow-sm">
              {isEditingLabel ? (
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleLabelSubmit}
                  className="bg-transparent border-none outline-none text-xs w-20 text-center"
                  placeholder="Edge label"
                  autoFocus
                />
              ) : (
                <span className="text-xs">{label}</span>
              )}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(CustomEdge);