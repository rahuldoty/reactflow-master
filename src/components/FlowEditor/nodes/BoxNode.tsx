import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';

interface BoxNodeData {
  label: string;
}

const BoxNode = ({ data, selected, id }: NodeProps<BoxNodeData>) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || 'Box Node');
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
        min-w-[120px] min-h-[80px] px-4 py-3 bg-node-bg border-2 rounded-lg shadow-medium
        flex items-center justify-center text-sm font-medium text-node-foreground
        transition-all duration-200 resize cursor-pointer
        ${selected ? 'border-node-selected shadow-strong' : 'border-node-border hover:border-primary/50'}
      `}
      onDoubleClick={handleDoubleClick}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-handle-bg border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !bg-handle-bg border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-handle-bg border-2 border-white"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !bg-handle-bg border-2 border-white"
      />

      {/* Content */}
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="bg-transparent border-none outline-none text-center min-w-0 w-full"
          autoFocus
        />
      ) : (
        <span className="text-center break-words">{label}</span>
      )}
    </div>
  );
};

export default memo(BoxNode);