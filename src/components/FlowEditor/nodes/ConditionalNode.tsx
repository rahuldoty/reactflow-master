import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';

interface ConditionalNodeData {
  label: string;
  condition?: string;
}

const ConditionalNode = ({ data, selected, id }: NodeProps<ConditionalNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'If Condition');
  const [condition, setCondition] = useState(data.condition || '');
  const { setNodes } = useReactFlow();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const updateNodeData = useCallback((newLabel: string, newCondition: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                label: newLabel,
                condition: newCondition 
              } 
            }
          : node
      )
    );
  }, [id, setNodes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditing(false);
      updateNodeData(label, condition);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(label, condition);
  };

  return (
    <div 
      className={`
        min-w-[140px] min-h-[100px] px-4 py-3 bg-node-bg border-2 shadow-medium
        flex flex-col items-center justify-center text-sm font-medium text-node-foreground
        transition-all duration-200 resize cursor-pointer transform rotate-45
        ${selected ? 'border-node-selected shadow-strong' : 'border-node-border hover:border-primary/50'}
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Handles - Top for input, Bottom-Left for True, Bottom-Right for False */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-handle-bg border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="w-3 h-3 !bg-green-500 border-2 border-white"
        style={{ left: '25%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="w-3 h-3 !bg-red-500 border-2 border-white"
        style={{ left: '75%' }}
      />

      {/* Content - Counter-rotate to keep text upright */}
      <div className="transform -rotate-45 text-center">
        {isEditing ? (
          <div className="flex flex-col gap-1">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="bg-transparent border-none outline-none text-center min-w-0 w-20 text-xs"
              placeholder="Label"
              autoFocus
            />
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className="bg-transparent border-b border-gray-400 outline-none text-center min-w-0 w-20 text-xs"
              placeholder="x > 10"
            />
          </div>
        ) : (
          <div>
            <div className="text-xs font-bold mb-1">{label}</div>
            {condition && <div className="text-xs text-muted-foreground">{condition}</div>}
            <div className="flex justify-between mt-2 text-xs">
              <span className="text-green-600">T</span>
              <span className="text-red-600">F</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ConditionalNode);
