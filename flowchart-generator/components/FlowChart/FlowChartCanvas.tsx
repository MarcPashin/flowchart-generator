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
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom node components
const ProcessNode = ({ data, id }: { data: any; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [dimensions, setDimensions] = useState({ width: 80, height: 40 });
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, scrollHeight } = textRef.current;
      setDimensions({
        width: Math.max(80, scrollWidth + 32),
        height: Math.max(40, scrollHeight + 16)
      });
    }
  }, [label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const event = new CustomEvent('updateNodeLabel', {
      detail: { id, label }
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div 
      className="shadow-md bg-white border-2"
      style={{ 
        borderColor: data.color || '#10B981',
        width: dimensions.width,
        height: dimensions.height,
        transition: 'width 0.2s, height 0.2s'
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center justify-center h-full px-4 py-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="text-sm font-medium bg-transparent border-none outline-none text-center w-full"
            style={{ minWidth: '60px' }}
          />
        ) : (
          <div ref={textRef} className="text-sm font-medium text-center w-full whitespace-pre-wrap">{label}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const DecisionNode = ({ data, id }: { data: any; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [size, setSize] = useState(80);
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, scrollHeight } = textRef.current;
      const maxDimension = Math.max(80, Math.max(scrollWidth, scrollHeight) * 1.4);
      setSize(maxDimension);
    }
  }, [label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const event = new CustomEvent('updateNodeLabel', {
      detail: { id, label }
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div 
      className="shadow-md bg-white"
      style={{ 
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        transform: 'rotate(45deg)',
        backgroundColor: 'white',
        transition: 'width 0.2s, height 0.2s',
        outline: `2px solid ${data.color || '#F59E0B'}`
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} style={{ transform: 'rotate(-45deg)', top: '-10px' }} />
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: 'rotate(-45deg)' }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="text-sm font-medium bg-transparent border-none outline-none text-center w-full"
            style={{ minWidth: '60px', padding: '0 8px' }}
          />
        ) : (
          <div ref={textRef} className="text-sm font-medium text-center w-full whitespace-pre-wrap px-4">{label}</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ transform: 'rotate(-45deg)', bottom: '-10px' }} />
      <Handle type="source" position={Position.Left} style={{ transform: 'rotate(-45deg)', left: '-10px' }} />
      <Handle type="source" position={Position.Right} style={{ transform: 'rotate(-45deg)', right: '-10px' }} />
    </div>
  );
};

const InputOutputNode = ({ data, id }: { data: any; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [dimensions, setDimensions] = useState({ width: 80, height: 40 });
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, scrollHeight } = textRef.current;
      setDimensions({
        width: Math.max(80, scrollWidth + 32),
        height: Math.max(40, scrollHeight + 16)
      });
    }
  }, [label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const event = new CustomEvent('updateNodeLabel', {
      detail: { id, label }
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const skewAmount = -20;

  return (
    <div 
      className="shadow-md bg-white border-2"
      style={{ 
        width: dimensions.width,
        height: dimensions.height,
        position: 'relative',
        transform: `skew(${skewAmount}deg)`,
        borderColor: data.color || '#EC4899',
        backgroundColor: 'white',
        transition: 'width 0.2s, height 0.2s'
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        style={{ transform: `skew(${-skewAmount}deg)`, left: '50%' }} 
      />
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `skew(${-skewAmount}deg)` }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="text-sm font-medium bg-transparent border-none outline-none text-center w-full"
            style={{ minWidth: '60px', padding: '0 8px' }}
          />
        ) : (
          <div ref={textRef} className="text-sm font-medium text-center w-full whitespace-pre-wrap px-4">{label}</div>
        )}
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        style={{ transform: `skew(${-skewAmount}deg)`, left: '50%' }} 
      />
    </div>
  );
};

const StartEndNode = ({ data, id }: { data: any; id: string }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [dimensions, setDimensions] = useState({ width: 80, height: 40 });
  const textRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, scrollHeight } = textRef.current;
      setDimensions({
        width: Math.max(80, scrollWidth + 32),
        height: Math.max(40, scrollHeight + 16)
      });
    }
  }, [label]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const event = new CustomEvent('updateNodeLabel', {
      detail: { id, label }
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div 
      className="shadow-md bg-white border-2 rounded-full"
      style={{ 
        borderColor: data.color || (data.type === 'start' ? '#4F46E5' : '#EF4444'),
        width: dimensions.width,
        height: dimensions.height,
        transition: 'width 0.2s, height 0.2s'
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type={data.type === 'start' ? 'source' : 'target'} position={data.type === 'start' ? Position.Bottom : Position.Top} />
      <div className="flex items-center justify-center h-full px-4 py-2">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="text-sm font-medium bg-transparent border-none outline-none text-center w-full"
            style={{ minWidth: '60px' }}
          />
        ) : (
          <div ref={textRef} className="text-sm font-medium text-center w-full whitespace-pre-wrap">{label}</div>
        )}
      </div>
      {data.type === 'end' && <Handle type="target" position={Position.Top} />}
      {data.type === 'start' && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
};

// Node types mapping
const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  input: InputOutputNode,
  start: StartEndNode,
  end: StartEndNode,
};

// Initial nodes and edges
const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

function FlowChartContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const { getViewport, screenToFlowPosition } = useReactFlow();

  // Function to add a new node
  const addNode = useCallback((type: string, position: XYPosition | null = null, data: any = {}) => {
    const viewport = getViewport();
    let nodePosition: XYPosition;

    if (position) {
      nodePosition = position;
    } else {
      // Get the center of the viewport
      const centerScreen = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
      nodePosition = screenToFlowPosition(centerScreen);
    }

    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: nodePosition,
      data: {
        label: data.label || type.charAt(0).toUpperCase() + type.slice(1),
        type,
        color: data.color,
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes, getViewport, screenToFlowPosition]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    setSelectedEdge(edge.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedEdge(null);
  }, []);

  const onEdgeDelete = useCallback((edge: Edge) => {
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    setSelectedEdge(null);
  }, [setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        animated: true,
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

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log('Node position updated:', node);
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (event.target as Element).closest('.react-flow')?.getBoundingClientRect();
      if (!reactFlowBounds) return;

      try {
        const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));
        
        const position = {
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        };

        addNode(data.type, position, data.data);
      } catch (error) {
        console.error('Error adding node:', error);
      }
    },
    [addNode]
  );

  // Function to export the flow chart
  const exportFlowChart = useCallback(() => {
    return {
      nodes,
      edges,
    };
  }, [nodes, edges]);

  // Make exportFlowChart available globally
  React.useEffect(() => {
    (window as any).exportFlowChart = exportFlowChart;
  }, [exportFlowChart]);

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
    
    return (
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <path
          id={id}
          style={{
            ...style,
            strokeWidth: isHovered ? 3 : 2,
            stroke: '#4F46E5',
          }}
          d={edgePath}
          markerEnd={markerEnd}
          className="react-flow__edge-path"
        />
        {isHovered && (
          <foreignObject
            width={20}
            height={20}
            x={(sourceX + targetX) / 2 - 10}
            y={(sourceY + targetY) / 2 - 10}
            className="edgebutton-foreignobject"
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <div
              className="absolute cursor-pointer bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                data?.onDelete?.();
              }}
            >
              ×
            </div>
          </foreignObject>
        )}
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges.map(edge => ({
          ...edge,
          data: {
            ...edge.data,
            onDelete: () => onEdgeDelete(edge),
          }
        }))}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={{
          default: CustomEdge,
        }}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Controls />
        <MiniMap
          nodeStrokeColor={(node) => {
            switch (node.type) {
              case 'process':
                return '#10B981';
              case 'decision':
                return '#F59E0B';
              case 'input':
                return '#EC4899';
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
              case 'input':
                return '#EC4899';
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
  );
}

export default function FlowChartCanvas() {
  return (
    <ReactFlowProvider>
      <FlowChartContent />
    </ReactFlowProvider>
  );
}