import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FlowNavbar from './FlowNavbar';
import BoxNode from './nodes/BoxNode';
import CircleNode from './nodes/CircleNode';
import DiamondNode from './nodes/DiamondNode';
import { useToast } from '@/hooks/use-toast';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'box',
    position: { x: 250, y: 100 },
    data: { label: 'Welcome Node' },
  },
];

const initialEdges: Edge[] = [];

// Auto-layout functions
const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'horizontal' | 'vertical' | 'tree'
) => {
  const layoutedNodes = [...nodes];
  
  if (direction === 'horizontal') {
    layoutedNodes.forEach((node, index) => {
      node.position = { x: index * 200, y: 100 };
    });
  } else if (direction === 'vertical') {
    layoutedNodes.forEach((node, index) => {
      node.position = { x: 200, y: index * 120 };
    });
  } else if (direction === 'tree') {
    // Simple tree layout
    const levels: { [key: number]: Node[] } = {};
    layoutedNodes.forEach((node, index) => {
      const level = Math.floor(index / 3);
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
    });
    
    Object.keys(levels).forEach((levelKey) => {
      const level = parseInt(levelKey);
      const levelNodes = levels[level];
      levelNodes.forEach((node, index) => {
        node.position = {
          x: index * 200 + (level % 2 === 1 ? 100 : 0),
          y: level * 120,
        };
      });
    });
  }
  
  return { nodes: layoutedNodes, edges };
};

const FlowEditor = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { toast } = useToast();

  const nodeTypes: NodeTypes = useMemo(
    () => ({
      box: BoxNode,
      circle: CircleNode,
      diamond: DiamondNode,
    }),
    []
  );

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const handleAddNode = useCallback((nodeType: 'box' | 'circle' | 'diamond') => {
    const id = `${nodeType}-${Date.now()}`;
    const newNode: Node = {
      id,
      type: nodeType,
      position: { 
        x: Math.random() * 500 + 100, 
        y: Math.random() * 300 + 100 
      },
      data: { 
        label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node` 
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    toast({
      title: "Node Added",
      description: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} node has been added to the flow.`,
    });
  }, [toast]);

  const handleAutoLayout = useCallback((layoutType: 'horizontal' | 'vertical' | 'tree') => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges,
      layoutType
    );
    
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    toast({
      title: "Layout Applied",
      description: `${layoutType.charAt(0).toUpperCase() + layoutType.slice(1)} layout has been applied.`,
    });
  }, [nodes, edges, toast]);

  const handleSave = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    
    localStorage.setItem('react-flow-data', JSON.stringify(flowData));
    
    toast({
      title: "Flow Saved",
      description: "Your flow has been saved to local storage.",
    });
  }, [nodes, edges, toast]);

  const handleLoad = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const flowData = JSON.parse(e.target?.result as string);
        if (flowData.nodes && flowData.edges) {
          setNodes(flowData.nodes);
          setEdges(flowData.edges);
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load flow. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  const handleExport = useCallback(() => {
    const flowData = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(flowData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Flow Exported",
      description: "Your flow has been exported as a JSON file.",
    });
  }, [nodes, edges, toast]);

  const handleClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    
    toast({
      title: "Flow Cleared",
      description: "All nodes and connections have been removed.",
    });
  }, [toast]);

  return (
    <div className="h-screen flex flex-col bg-flow-bg">
      <FlowNavbar
        onSave={handleSave}
        onLoad={handleLoad}
        onClear={handleClear}
        onExport={handleExport}
        onAddNode={handleAddNode}
        onAutoLayout={handleAutoLayout}
      />
      
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-flow-bg"
        >
          <Controls className="bg-card border border-border shadow-medium" />
          <MiniMap 
            className="bg-card border border-border shadow-medium"
            nodeColor="#8b5cf6"
            maskColor="rgba(0, 0, 0, 0.1)"
          />
          <Background 
            color="hsl(var(--flow-grid))" 
            gap={20} 
            size={1}
          />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowEditor;