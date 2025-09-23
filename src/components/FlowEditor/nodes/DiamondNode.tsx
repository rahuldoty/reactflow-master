import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';

interface DiamondNodeData {
  label: string;
}

const DiamondNode = ({ data, selected, id }: NodeProps<DiamondNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Diamond Node');
  const { setNodes } = useReactFlow();

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const updateNodeLabel = useCallback((newLabel: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  }, [id, setNodes]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditing(false);
      updateNodeLabel(label);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeLabel(label);
  };

  return (
    <div 
      className={`
        w-24 h-24 bg-node-bg border-2 shadow-medium
        flex items-center justify-center text-sm font-medium text-node-foreground
        transition-all duration-200 resize cursor-pointer transform rotate-45
        ${selected ? 'border-node-selected shadow-strong' : 'border-node-border hover:border-primary/50'}
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-handle-bg border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-handle-bg border-2 border-white"
      />

      {/* Content - Counter-rotate to keep text upright */}
      <div className="transform -rotate-45">
        {isEditing ? (
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="bg-transparent border-none outline-none text-center min-w-0 w-12 text-xs"
            autoFocus
          />
        ) : (
          <span className="text-center break-words text-xs px-2">{label}</span>
        )}
      </div>
    </div>
  );
};

export default memo(DiamondNode);
