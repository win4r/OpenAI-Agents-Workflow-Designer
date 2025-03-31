import { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import './App.css';

import { nodeTypes } from './components/NodeTypes';
import { ComponentsPanel, PropertiesPanel } from './components/Panels';
import CodeGenerator from './components/CodeGenerator';
import useWorkflow from './hooks/useWorkflow';
import { Button } from 'antd';
import { CodeOutlined } from '@ant-design/icons';

function App() {
  const {
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
  } = useWorkflow();

  const onInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
  }, [reactFlowInstance]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, [setSelectedNode]);

  return (
    <div className="app-container">
      <div className="app-header">
        <div className="app-title">OpenAI Agents Workflow Designer</div>
        <div className="app-actions">
          <Button 
            type="primary" 
            icon={<CodeOutlined />} 
            onClick={onGenerateCode}
          >
            Generate Code
          </Button>
        </div>
      </div>
      
      <div className="app-content">
        <div className="left-panel">
          <ComponentsPanel onDragStart={onDragStart} />
        </div>
        
        <div 
          className="canvas-area" 
          ref={reactFlowWrapper}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            onInit={onInit}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onNodesDelete={onNodesDelete}
            onEdgesDelete={onEdgesDelete}
            fitView
            deleteKeyCode="Delete"
            multiSelectionKeyCode="Control"
            selectionKeyCode="Shift"
          >
            <Background />
            <Controls />
            <MiniMap 
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
            <Panel position="bottom-center">
              <div style={{ 
                background: 'white', 
                padding: '8px 15px', 
                borderRadius: '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                fontSize: '12px',
                color: '#666'
              }}>
                Tip: Connect Agent → Agent for handoffs, Function → Agent for tools, Agent → Runner for execution
              </div>
            </Panel>
          </ReactFlow>
        </div>
        
        <div className="right-panel">
          <PropertiesPanel 
            selectedNode={selectedNode} 
            onNodeDataChange={onNodeDataChange}
          />
        </div>
      </div>
      
      <CodeGenerator 
        visible={codeModalVisible}
        onClose={onCloseCodeModal}
        nodes={nodes}
        edges={edges}
      />
    </div>
  );
}

export default App;
