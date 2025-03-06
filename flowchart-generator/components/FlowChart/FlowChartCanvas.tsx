'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  Connection,
  MarkerType,
  XYPosition,
  Handle,
  Position,
  BaseEdge,
  EdgeProps,
  getBezierPath,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Node Edit Modal Component
const NodeEditModal = ({ 
  isOpen, 
  onClose, 
  node, 
  onSave,
  onDelete,
  isCreating = false
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  node: { id: string, type: string, label: string, width: number, height: number, x?: number, y?: number } | null, 
  onSave: (id: string, label: string, width: number, height: number, x?: number, y?: number) => void,
  onDelete?: (id: string) => void,
  isCreating?: boolean
}) => {
  const [label, setLabel] = useState('');
  const [width, setWidth] = useState(180);
  const [height, setHeight] = useState(60);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && node) {
      setLabel(node.label);
      setWidth(node.width);
      setHeight(node.height);
      setX(node.x || 0);
      setY(node.y || 0);
      // Focus the input when modal opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen, node]);

  const handleSave = () => {
    if (node) {
      onSave(node.id, label, width, height, x, y);
      onClose();
    }
  };

  const handleDelete = () => {
    if (node && onDelete) {
      onDelete(node.id);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen || !node) return null;

  // Get properly formatted node type name
  const nodeTypeName = node.type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleKeyDown}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {isCreating ? `Create ${nodeTypeName} Node` : `Edit ${nodeTypeName} Node`}
        </h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Node Text</label>
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            onKeyDown={handleKeyDown}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Width (px)</label>
            <input
              type="number"
              value={width}
              min={100}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height (px)</label>
            <input
              type="number"
              value={height}
              min={40}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">X Position</label>
            <input
              type="number"
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Y Position</label>
            <input
              type="number"
              value={y}
              onChange={(e) => setY(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          {!isCreating && onDelete && (
            <button 
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          )}
          
          <div className="flex justify-end space-x-3 ml-auto">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {isCreating ? 'Create' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom node components
const ProcessNode = ({ data, id }: { data: any; id: string }) => {
  const { dimensions = { width: 180, height: 60 } } = data;
  
  return (
    <div 
      className="shadow-md bg-white border-2 relative"
      style={{ 
        borderColor: data.color || '#10B981',
        width: dimensions.width,
        height: dimensions.height,
        transition: 'width 0.3s, height 0.3s'
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center h-full px-6 py-4">
        <div 
          className="text-sm font-medium text-center w-full break-words"
          style={{ wordBreak: "break-word", maxWidth: "100%" }}
        >
          {data.label}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const DecisionNode = ({ data, id }: { data: any; id: string }) => {
  const { dimensions = { size: 160 } } = data;
  
  // Calculate the available text space
  const availableTextWidth = dimensions.size * 0.7; // Reduce by 30% to account for diamond shape
  
  return (
    <div 
      className="shadow-md bg-white relative"
      style={{ 
        width: dimensions.size,
        height: dimensions.size,
        transition: 'width 0.3s, height 0.3s',
        transform: 'rotate(45deg)',
        position: 'relative',
        borderColor: data.color || '#FCD34D',
        borderWidth: '2px',
        borderStyle: 'solid'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',
          width: availableTextWidth,
          maxWidth: '100%',
          padding: '0 8px'
        }}
      >
        <div 
          className="text-sm font-medium text-center break-words"
          style={{ 
            maxWidth: availableTextWidth,
            wordBreak: "break-word"
          }}
        >
          {data.label}
        </div>
      </div>
      
      {/* Handles positioned with negative transform to adjust for the 45-degree rotation */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ transform: 'rotate(-45deg) translateX(0) translateY(-50%)', top: 0, left: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ transform: 'rotate(-45deg) translateX(0) translateY(50%)', bottom: 0, left: '50%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ transform: 'rotate(-45deg) translateX(-50%) translateY(0)', left: 0, top: '50%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ transform: 'rotate(-45deg) translateX(50%) translateY(0)', right: 0, top: '50%' }}
      />
    </div>
  );
};

const InputOutputNode = ({ data, id }: { data: any; id: string }) => {
  const { dimensions = { width: 180, height: 60 } } = data;
  const skewAmount = '20deg';
  
  return (
    <div
      className="shadow-md relative"
      style={{ 
        width: dimensions.width,
        height: dimensions.height,
        transition: 'width 0.3s, height 0.3s',
        position: 'relative',
      }}
    >
      {/* The parallelogram shape */}
      <div
        className="absolute inset-0 bg-white border-2"
        style={{
          borderColor: data.color || '#818CF8',
          clipPath: `polygon(20px 0, 100% 0, calc(100% - 20px) 100%, 0 100%)`,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="text-sm font-medium text-center w-full px-6 break-words"
            style={{ wordBreak: "break-word", maxWidth: "100%" }}
          >
            {data.label}
          </div>
        </div>
      </div>
      
      <Handle type="target" position={Position.Top} style={{ zIndex: 3 }} />
      <Handle type="source" position={Position.Bottom} style={{ zIndex: 3 }} />
    </div>
  );
};

const StartEndNode = ({ data, id }: { data: any; id: string }) => {
  const { dimensions = { width: 180, height: 60 } } = data;
  
  return (
    <div 
      className="shadow-md bg-white border-2 rounded-full relative"
      style={{ 
        borderColor: data.type === 'start' ? '#4F46E5' : '#EF4444',
        width: dimensions.width,
        height: dimensions.height,
        transition: 'width 0.3s, height 0.3s'
      }}
    >
      {data.type === 'start' ? null : <Handle type="target" position={Position.Top} />}
      <div className="flex items-center justify-center h-full px-6 py-4">
        <div 
          className="text-sm font-medium text-center w-full break-words"
          style={{ wordBreak: "break-word", maxWidth: "100%" }}
        >
          {data.label}
        </div>
      </div>
      {data.type === 'end' ? null : <Handle type="source" position={Position.Bottom} />}
    </div>
  );
};

// Node types mapping
const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  input_output: InputOutputNode,
  start: StartEndNode,
  end: StartEndNode,
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition: Position.Bottom,
    targetX,
    targetY,
    targetPosition: Position.Top,
  });

  // Calculate middle point of the edge
  const middleX = (sourceX + targetX) / 2;
  const middleY = (sourceY + targetY) / 2;

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    data?.onDelete?.();
  };

  return (
    <g 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <path
        style={{
          strokeWidth: 2,
          stroke: '#4F46E5',
        }}
        d={edgePath}
        markerEnd={markerEnd}
        className="react-flow__edge-path"
      />
      
      {/* This invisible wider path makes it easier to hover over the connection */}
      <path
        d={edgePath}
        fill="none"
        strokeWidth={16}
        stroke="transparent"
        strokeLinecap="round"
        strokeLinejoin="round"
        onMouseEnter={() => setIsHovered(true)}
        style={{ pointerEvents: 'stroke' }}
      />
      
      {isHovered && (
        <foreignObject
          width={24}
          height={24}
          x={middleX - 12}
          y={middleY - 12}
          className="edgebutton-foreignobject"
          requiredExtensions="http://www.w3.org/1999/xhtml"
        >
          <div
            className="absolute cursor-pointer bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow-md text-lg font-bold"
            onClick={handleDeleteClick}
          >
            ×
          </div>
        </foreignObject>
      )}
    </g>
  );
};

function FlowChartContent() {
  // State for tracking selected node and editing
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<{
    id: string;
    type: string;
    label: string;
    width: number;
    height: number;
    x?: number;
    y?: number;
  } | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isCreatingNewNode, setIsCreatingNewNode] = useState(false);
  const [newNodeType, setNewNodeType] = useState<string | null>(null);
  const [isResizingAnyNode, setIsResizingAnyNode] = useState(false);
  
  // Initial nodes state
  const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const { getViewport, screenToFlowPosition } = useReactFlow();

  // Function to delete a node
  const deleteNode = useCallback((nodeId: string) => {
    // First, remove any edges connected to this node
    setEdges((eds) => eds.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ));
    
    // Then remove the node
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    
    // Clear selected node if it was deleted
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  }, [setEdges, setNodes, selectedNode]);

  // Function to delete an edge
  const deleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  }, [setEdges]);

  // Event handlers for node editing
  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();
    
    // Determine type and dimensions based on node type
    const nodeType = node.type || 'process';
    const dimensions = node.data?.dimensions || 
      (nodeType === 'decision' 
        ? { size: 160 }
        : { width: 180, height: 60 });
    
    // Set the selected node for the modal
    setEditingNode({
      id: node.id,
      type: nodeType,
      label: node.data?.label || '',
      width: dimensions.width || dimensions.size || 180,
      height: dimensions.height || dimensions.size || 60,
      x: node.position.x,
      y: node.position.y
    });
    
    setEditModalOpen(true);
    setIsCreatingNewNode(false);
  }, []);
  
  // Function to handle node click - for selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    setSelectedNode(node);
  }, []);
  
  // Handle keyboard events for deleting nodes or edges
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNode) {
          // Delete the selected node
          deleteNode(selectedNode.id);
          setSelectedNode(null);
        } else if (selectedEdge) {
          // Delete the selected edge
          deleteEdge(selectedEdge);
          setSelectedEdge(null);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [deleteNode, deleteEdge, selectedNode, selectedEdge]);
  
  // Function to handle pane click to deselect everything
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
    
    // Clear edge selection styling
    setEdges(eds => 
      eds.map(e => ({
        ...e,
        data: {
          ...e.data,
          selected: false
        }
      }))
    );
  }, [setEdges]);
  
  // Function to initiate node creation
  const initiateNodeCreation = useCallback((type: string) => {
    setIsCreatingNewNode(true);
    setNewNodeType(type);
    
    // Calculate default position in the center of the viewport
    const position = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });
    
    // Set default values for the new node
    const defaultDimensions = type === 'decision' 
      ? { width: 160, height: 160 } 
      : { width: 180, height: 60 };
      
    setEditingNode({
      id: 'new_node',
      type,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      width: defaultDimensions.width,
      height: defaultDimensions.height,
      x: Math.round(position.x),
      y: Math.round(position.y)
    });
    
    setEditModalOpen(true);
  }, [screenToFlowPosition]);
  
  // Handle saving node edits from modal
  const handleSaveNodeEdit = useCallback((id: string, label: string, width: number, height: number, x?: number, y?: number) => {
    if (isCreatingNewNode && newNodeType) {
      // Create a new node with the specified dimensions and label
      const position = { 
        x: x !== undefined ? x : 100,
        y: y !== undefined ? y : 100
      };
      
      const dimensions = 
        newNodeType === 'decision' 
          ? { size: Math.max(width, height) } 
          : { width, height };
      
      const newNode: Node = {
        id: `node_${Date.now()}`,
        type: newNodeType,
        position,
        data: {
          label,
          type: newNodeType === 'start' || newNodeType === 'end' ? newNodeType : undefined,
          dimensions,
        },
      };
      
      setNodes((nds) => nds.concat(newNode));
      setNewNodeType(null);
    } else {
      // Update existing node
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                label,
                dimensions: node.type === 'decision'
                  ? { size: Math.max(width, height) } // For decision node, use the larger dimension
                  : { width, height }
              },
              position: x !== undefined && y !== undefined ? { x, y } : node.position
            };
            return updatedNode;
          }
          return node;
        })
      );
    }
  }, [isCreatingNewNode, newNodeType, setNodes]);
  
  // Handle edge click
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedNode(null);
    setSelectedEdge(edge.id);
    
    // Update edges to reflect selection state
    setEdges(eds => 
      eds.map(e => ({
        ...e,
        data: {
          ...e.data,
          selected: e.id === edge.id
        }
      }))
    );
  }, [setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        animated: false,
        style: { stroke: '#4F46E5', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#4F46E5',
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );
  
  // Drag and drop functionality for toolbar items
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow');
      
      if (typeof type === 'undefined' || !type) {
        return;
      }
      
      // Get drop position in flow coordinates
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      
      // Show modal for creating new node at the drop position
      setIsCreatingNewNode(true);
      setNewNodeType(type);
      
      // Set default values for the new node
      const defaultDimensions = type === 'decision' 
        ? { width: 160, height: 160 } 
        : { width: 180, height: 60 };
        
      setEditingNode({
        id: 'new_node',
        type,
        label: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        width: defaultDimensions.width,
        height: defaultDimensions.height,
        x: Math.round(position.x),
        y: Math.round(position.y)
      });
      
      setEditModalOpen(true);
    },
    [screenToFlowPosition]
  );

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // You can implement additional logic when a node stops being dragged
    },
    []
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div className="flex h-full">
        {/* Main canvas area */}
        <div className="flex-grow h-full">
      <ReactFlow
        nodes={nodes}
            edges={edges.map(edge => ({
              ...edge,
              data: {
                ...edge.data,
                onDelete: () => deleteEdge(edge.id),
              }
            }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
            onNodeDoubleClick={onNodeDoubleClick}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes}
            edgeTypes={{
              default: CustomEdge,
            }}
            onDragOver={onDragOver}
            onDrop={onDrop}
        fitView
            snapToGrid
            snapGrid={[15, 15]}
            // Apply selection styles to make it clear which node is selected
            nodesFocusable={true}
            elementsSelectable={true}
            selectNodesOnDrag={false}
      >
        <Controls />
        <MiniMap
              nodeStrokeColor={(node) => {
                switch (node.type) {
                  case 'process':
                    return '#10B981';
                  case 'decision':
                    return '#F59E0B';
                  case 'input_output':
                    return '#818CF8';
                  case 'start':
                    return '#4F46E5';
                  case 'end':
                    return '#EF4444';
                  default:
                    return '#eee';
                }
              }}
              nodeColor={(node) => {
                switch (node.type) {
                  case 'process':
                    return '#10B981';
                  case 'decision':
                    return '#F59E0B';
                  case 'input_output':
                    return '#818CF8';
                  case 'start':
                    return '#4F46E5';
                  case 'end':
                    return '#EF4444';
                  default:
                    return '#fff';
                }
          }}
          nodeBorderRadius={2}
        />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
        
        {/* Toolbar (right side) */}
        <div className="w-64 bg-gray-50 border-l p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Add Node</h2>
          
          {/* Node types */}
          <div className="space-y-4 mb-6">
            <div 
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => initiateNodeCreation('start')}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'start');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full border-2 border-indigo-600 flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-medium">Start</div>
                <div className="text-xs text-gray-500">Add a starting point (required)</div>
              </div>
            </div>
            
            <div 
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => initiateNodeCreation('process')}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'process');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-emerald-500"></div>
              </div>
              <div>
                <div className="font-medium">Process</div>
                <div className="text-xs text-gray-500">Add a process or action step</div>
              </div>
            </div>
            
            <div 
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => initiateNodeCreation('decision')}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'decision');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-amber-400 transform rotate-45"></div>
              </div>
              <div>
                <div className="font-medium">Decision</div>
                <div className="text-xs text-gray-500">Add a yes/no decision point</div>
              </div>
            </div>
            
            <div 
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => initiateNodeCreation('input_output')}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'input_output');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-indigo-400 transform skew-x-12"></div>
              </div>
              <div>
                <div className="font-medium">Input/Output</div>
                <div className="text-xs text-gray-500">Add data input or output</div>
              </div>
            </div>
            
            <div 
              className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => initiateNodeCreation('end')}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/reactflow', 'end');
                event.dataTransfer.effectAllowed = 'move';
              }}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full border-2 border-red-500 flex items-center justify-center text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </div>
              </div>
              <div>
                <div className="font-medium">End</div>
                <div className="text-xs text-gray-500">Add an end point (required)</div>
              </div>
            </div>
          </div>
          
          {/* Color palette section */}
          <h2 className="text-lg font-semibold mb-3">Colors</h2>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {/* Color options - each is a circle */}
            <button className="w-8 h-8 rounded-full bg-yellow-300 hover:ring-2 hover:ring-offset-2 hover:ring-yellow-300"></button>
            <button className="w-8 h-8 rounded-full bg-blue-400 hover:ring-2 hover:ring-offset-2 hover:ring-blue-400"></button>
            <button className="w-8 h-8 rounded-full bg-green-400 hover:ring-2 hover:ring-offset-2 hover:ring-green-400"></button>
            <button className="w-8 h-8 rounded-full bg-red-400 hover:ring-2 hover:ring-offset-2 hover:ring-red-400"></button>
            <button className="w-8 h-8 rounded-full bg-purple-400 hover:ring-2 hover:ring-offset-2 hover:ring-purple-400"></button>
            <button className="w-8 h-8 rounded-full bg-amber-400 hover:ring-2 hover:ring-offset-2 hover:ring-amber-400"></button>
            <button className="w-8 h-8 rounded-full bg-pink-400 hover:ring-2 hover:ring-offset-2 hover:ring-pink-400"></button>
            <button className="w-8 h-8 rounded-full bg-teal-400 hover:ring-2 hover:ring-offset-2 hover:ring-teal-400"></button>
          </div>
          
          {/* Custom color picker */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Custom Color</label>
            <div className="flex gap-2">
              <input 
                type="color"
                className="w-10 h-10 border-0 p-0 rounded"
              />
              <input 
                type="text"
                placeholder="#FFDC62"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          {/* Apply to section */}
          <h2 className="text-lg font-semibold mb-3">Apply To</h2>
          <div className="space-y-2 mb-4">
            <button className="w-full py-2 px-4 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              All Nodes
            </button>
            <button className="w-full py-2 px-4 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              Selected Node
            </button>
            <button className="w-full py-2 px-4 bg-white text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
              Connections
            </button>
          </div>
        </div>
      </div>

      {/* Node Edit Modal */}
      <NodeEditModal 
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setIsCreatingNewNode(false);
          setNewNodeType(null);
        }}
        node={editingNode}
        onSave={handleSaveNodeEdit}
        onDelete={deleteNode}
        isCreating={isCreatingNewNode}
      />
    </div>
  );
}

export default function FlowChartCanvas() {
  return (
    <ReactFlowProvider>
      <FlowChartContent />
    </ReactFlowProvider>
  );
}