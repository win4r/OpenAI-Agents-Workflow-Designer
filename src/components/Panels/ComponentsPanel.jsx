import { useCallback } from 'react';
import { Typography, Divider } from 'antd';
import { 
  UserOutlined, 
  PlayCircleOutlined, 
  ToolOutlined 
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ComponentsPanel = ({ onDragStart }) => {
  const handleDragStart = useCallback((event, nodeType, nodeData) => {
    if (onDragStart) {
      onDragStart(event, nodeType, nodeData);
    }
  }, [onDragStart]);

  return (
    <div className="components-panel">
      <Title level={4} className="panel-title">Components</Title>
      
      <div 
        className="component-item"
        draggable
        onDragStart={(event) => handleDragStart(event, 'agent', {
          label: 'Agent',
          name: '',
          instructions: '',
          handoffs: [],
          tools: []
        })}
      >
        <UserOutlined className="component-icon" style={{ color: '#3498db' }} />
        <div className="component-info">
          <div className="component-name">Agent</div>
          <div className="component-desc">OpenAI Agent with instructions</div>
        </div>
      </div>
      
      <div 
        className="component-item"
        draggable
        onDragStart={(event) => handleDragStart(event, 'runner', {
          label: 'Runner',
          input: '',
          isAsync: false
        })}
      >
        <PlayCircleOutlined className="component-icon" style={{ color: '#e74c3c' }} />
        <div className="component-info">
          <div className="component-name">Runner</div>
          <div className="component-desc">Executes an agent with input</div>
        </div>
      </div>
      
      <div 
        className="component-item"
        draggable
        onDragStart={(event) => handleDragStart(event, 'functionTool', {
          label: 'Function Tool',
          name: '',
          parameters: [],
          returnType: 'str',
          implementation: ''
        })}
      >
        <ToolOutlined className="component-icon" style={{ color: '#f39c12' }} />
        <div className="component-info">
          <div className="component-name">Function Tool</div>
          <div className="component-desc">Custom function tool for agents</div>
        </div>
      </div>
      
      <Divider />
      
      <Paragraph style={{ fontSize: '0.9rem', color: '#666' }}>
        Drag components to the canvas to create a workflow. Connect nodes to establish relationships.
      </Paragraph>
      
      <Paragraph style={{ fontSize: '0.9rem', color: '#666' }}>
        <strong>Connections:</strong>
        <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
          <li>Agent → Agent: Handoff</li>
          <li>Function → Agent: Tool</li>
          <li>Agent → Runner: Execution</li>
        </ul>
      </Paragraph>
    </div>
  );
};

export default ComponentsPanel;