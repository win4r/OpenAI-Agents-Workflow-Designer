import { useState, useCallback, useRef } from 'react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  getConnectedEdges,
  updateEdge
} from 'reactflow';

const useWorkflow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [codeModalVisible, setCodeModalVisible] = useState(false);
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);

  // 处理节点选择
  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  // 处理节点数据变更
  const onNodeDataChange = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          };
        }
        return node;
      })
    );

    // 更新选中节点的数据
    setSelectedNode((prev) => {
      if (prev && prev.id === nodeId) {
        return {
          ...prev,
          data: {
            ...prev.data,
            ...newData,
          },
        };
      }
      return prev;
    });
  }, [setNodes]);

  // 处理连接创建
  const onConnect = useCallback((params) => {
    // 获取源节点和目标节点
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);
    
    if (!sourceNode || !targetNode) return;

    // 检查连接是否有效
    let isValidConnection = false;
    let edgeType = '';

    // Agent -> Agent: 表示handoff关系
    if (sourceNode.type === 'agent' && targetNode.type === 'agent') {
      isValidConnection = true;
      edgeType = 'edge-agent-agent';
      
      // 更新源Agent的handoffs
      setNodes(nds => 
        nds.map(node => {
          if (node.id === sourceNode.id) {
            const handoffs = [...(node.data.handoffs || [])];
            const existingHandoff = handoffs.find(h => h.id === targetNode.id);
            
            if (!existingHandoff) {
              handoffs.push({
                id: targetNode.id,
                name: targetNode.data.name
              });
            }
            
            return {
              ...node,
              data: {
                ...node.data,
                handoffs
              }
            };
          }
          return node;
        })
      );
    }
    
    // Function -> Agent: 表示tool关系
    else if (sourceNode.type === 'functionTool' && targetNode.type === 'agent') {
      isValidConnection = true;
      edgeType = 'edge-function-agent';
      
      // 更新目标Agent的tools
      setNodes(nds => 
        nds.map(node => {
          if (node.id === targetNode.id) {
            const tools = [...(node.data.tools || [])];
            const existingTool = tools.find(t => t.id === sourceNode.id);
            
            if (!existingTool) {
              tools.push({
                id: sourceNode.id,
                name: sourceNode.data.name
              });
            }
            
            return {
              ...node,
              data: {
                ...node.data,
                tools
              }
            };
          }
          return node;
        })
      );
    }
    
    // Agent -> Runner: 表示执行关系
    else if (sourceNode.type === 'agent' && targetNode.type === 'runner') {
      isValidConnection = true;
      edgeType = 'edge-agent-runner';
      
      // 更新Runner的agent
      setNodes(nds => 
        nds.map(node => {
          if (node.id === targetNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                agent: {
                  id: sourceNode.id,
                  name: sourceNode.data.name
                }
              }
            };
          }
          return node;
        })
      );
    }

    if (isValidConnection) {
      const newEdge = {
        ...params,
        animated: true,
        className: edgeType
      };
      setEdges(eds => addEdge(newEdge, eds));
    }
  }, [nodes, setNodes, setEdges]);

  // 处理边缘更新
  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    setEdges(eds => updateEdge(oldEdge, newConnection, eds));
  }, [setEdges]);

  // 处理拖放
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // 处理组件拖放开始
  const onDragStart = useCallback((event, nodeType, nodeData) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/reactflow/data', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  // 处理组件放置
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow/data') || '{}');
      
      if (!type || !reactFlowInstance.current) {
        return;
      }

      const position = reactFlowInstance.current.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          ...nodeData,
          onNodeClick,
          onNodeDataChange,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [onNodeClick, onNodeDataChange, setNodes]
  );

  // 处理节点删除
  const onNodesDelete = useCallback((nodesToDelete) => {
    // 删除与节点相关的边
    const nodeIds = nodesToDelete.map(node => node.id);
    const edgesToDelete = edges.filter(
      edge => nodeIds.includes(edge.source) || nodeIds.includes(edge.target)
    );
    
    if (edgesToDelete.length > 0) {
      setEdges(eds => eds.filter(edge => !edgesToDelete.includes(edge)));
    }
    
    // 更新其他节点的引用
    setNodes(nds => 
      nds.map(node => {
        let updatedNode = { ...node };
        
        // 更新Agent的handoffs
        if (node.type === 'agent' && node.data.handoffs) {
          updatedNode.data = {
            ...updatedNode.data,
            handoffs: node.data.handoffs.filter(h => !nodeIds.includes(h.id))
          };
        }
        
        // 更新Agent的tools
        if (node.type === 'agent' && node.data.tools) {
          updatedNode.data = {
            ...updatedNode.data,
            tools: node.data.tools.filter(t => !nodeIds.includes(t.id))
          };
        }
        
        // 更新Runner的agent
        if (node.type === 'runner' && node.data.agent && nodeIds.includes(node.data.agent.id)) {
          updatedNode.data = {
            ...updatedNode.data,
            agent: null
          };
        }
        
        return updatedNode;
      })
    );
    
    // 如果删除的节点是当前选中的节点，清除选中状态
    if (selectedNode && nodeIds.includes(selectedNode.id)) {
      setSelectedNode(null);
    }
  }, [edges, selectedNode, setEdges, setNodes]);

  // 处理边缘删除
  const onEdgesDelete = useCallback((edgesToDelete) => {
    // 获取要删除的边的源节点和目标节点
    edgesToDelete.forEach(edge => {
      const sourceNode = nodes.find(node => node.id === edge.source);
      const targetNode = nodes.find(node => node.id === edge.target);
      
      if (!sourceNode || !targetNode) return;
      
      // Agent -> Agent: 删除handoff关系
      if (sourceNode.type === 'agent' && targetNode.type === 'agent') {
        setNodes(nds => 
          nds.map(node => {
            if (node.id === sourceNode.id && node.data.handoffs) {
              return {
                ...node,
                data: {
                  ...node.data,
                  handoffs: node.data.handoffs.filter(h => h.id !== targetNode.id)
                }
              };
            }
            return node;
          })
        );
      }
      
      // Function -> Agent: 删除tool关系
      else if (sourceNode.type === 'functionTool' && targetNode.type === 'agent') {
        setNodes(nds => 
          nds.map(node => {
            if (node.id === targetNode.id && node.data.tools) {
              return {
                ...node,
                data: {
                  ...node.data,
                  tools: node.data.tools.filter(t => t.id !== sourceNode.id)
                }
              };
            }
            return node;
          })
        );
      }
      
      // Agent -> Runner: 删除执行关系
      else if (sourceNode.type === 'agent' && targetNode.type === 'runner') {
        setNodes(nds => 
          nds.map(node => {
            if (node.id === targetNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  agent: null
                }
              };
            }
            return node;
          })
        );
      }
    });
  }, [nodes, setNodes]);

  // 处理代码生成
  const onGenerateCode = useCallback(() => {
    setCodeModalVisible(true);
  }, []);

  // 关闭代码生成弹窗
  const onCloseCodeModal = useCallback(() => {
    setCodeModalVisible(false);
  }, []);

  return {
    nodes,
    edges,
    selectedNode,
    codeModalVisible,
    reactFlowWrapper,
    reactFlowInstance,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeUpdate,
    onDragOver,
    onDragStart,
    onDrop,
    onNodeClick,
    onNodeDataChange,
    onNodesDelete,
    onEdgesDelete,
    onGenerateCode,
    onCloseCodeModal,
    setSelectedNode
  };
};

export default useWorkflow;