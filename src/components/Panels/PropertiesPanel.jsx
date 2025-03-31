import { useCallback } from 'react';
import { Typography, Empty, Input, Select, Switch, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const PropertiesPanel = ({ selectedNode, onNodeDataChange }) => {
  const [newParamName, setNewParamName] = useState('');
  const [newParamType, setNewParamType] = useState('str');

  const handleNameChange = useCallback((e) => {
    if (selectedNode && onNodeDataChange) {
      onNodeDataChange(selectedNode.id, { ...selectedNode.data, name: e.target.value });
    }
  }, [selectedNode, onNodeDataChange]);

  const handleInstructionsChange = useCallback((e) => {
    if (selectedNode && onNodeDataChange) {
      onNodeDataChange(selectedNode.id, { ...selectedNode.data, instructions: e.target.value });
    }
  }, [selectedNode, onNodeDataChange]);

  const handleInputChange = useCallback((e) => {
    if (selectedNode && onNodeDataChange) {
      onNodeDataChange(selectedNode.id, { ...selectedNode.data, input: e.target.value });
    }
  }, [selectedNode, onNodeDataChange]);

  const handleModeChange = useCallback((checked) => {
    if (selectedNode && onNodeDataChange) {
      onNodeDataChange(selectedNode.id, { ...selectedNode.data, isAsync: checked });
    }
  }, [selectedNode, onNodeDataChange]);

  const handleReturnTypeChange = useCallback((value) => {
    if (selectedNode && onNodeDataChange) {
      onNodeDataChange(selectedNode.id, { ...selectedNode.data, returnType: value });
    }
  }, [selectedNode, onNodeDataChange]);

  const handleImplementationChange = useCallback((e) => {
    if (selectedNode && onNodeDataChange) {
      onNodeDataChange(selectedNode.id, { ...selectedNode.data, implementation: e.target.value });
    }
  }, [selectedNode, onNodeDataChange]);

  const handleAddParameter = useCallback(() => {
    if (!selectedNode || !newParamName.trim()) return;
    
    const newParam = {
      name: newParamName,
      type: newParamType
    };
    
    const updatedParams = [...(selectedNode.data.parameters || []), newParam];
    
    if (onNodeDataChange) {
      onNodeDataChange(selectedNode.id, { ...selectedNode.data, parameters: updatedParams });
    }
    
    setNewParamName('');
    setNewParamType('str');
  }, [selectedNode, newParamName, newParamType, onNodeDataChange]);

  const handleRemoveParameter = useCallback((index) => {
    if (!selectedNode) return;
    
    const updatedParams = [...(selectedNode.data.parameters || [])];
    updatedParams.splice(index, 1);
    
    if (onNodeDataChange) {
      onNodeDataChange(selectedNode.id, { ...selectedNode.data, parameters: updatedParams });
    }
  }, [selectedNode, onNodeDataChange]);

  if (!selectedNode) {
    return (
      <div className="properties-panel">
        <Title level={4} className="panel-title">Properties</Title>
        <Empty description="Select a node to view properties" />
      </div>
    );
  }

  const renderAgentProperties = () => (
    <>
      <div className="property-group">
        <div className="property-label">Name</div>
        <Input 
          value={selectedNode.data.name || ''} 
          onChange={handleNameChange}
          placeholder="Agent name"
        />
      </div>
      <div className="property-group">
        <div className="property-label">Instructions</div>
        <TextArea 
          rows={6} 
          value={selectedNode.data.instructions || ''} 
          onChange={handleInstructionsChange}
          placeholder="Agent instructions"
        />
      </div>
      {selectedNode.data.handoffs && selectedNode.data.handoffs.length > 0 && (
        <div className="property-group">
          <div className="property-label">Handoffs</div>
          <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
            {selectedNode.data.handoffs.map(handoff => (
              <li key={handoff.id}>{handoff.name || handoff.id}</li>
            ))}
          </ul>
        </div>
      )}
      {selectedNode.data.tools && selectedNode.data.tools.length > 0 && (
        <div className="property-group">
          <div className="property-label">Tools</div>
          <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
            {selectedNode.data.tools.map(tool => (
              <li key={tool.id}>{tool.name || tool.id}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  const renderRunnerProperties = () => (
    <>
      <div className="property-group">
        <div className="property-label">Input</div>
        <Input 
          value={selectedNode.data.input || ''} 
          onChange={handleInputChange}
          placeholder="Runner input"
        />
      </div>
      <div className="property-group">
        <div className="property-label">Execution Mode</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}>Sync</span>
          <Switch 
            checked={selectedNode.data.isAsync} 
            onChange={handleModeChange}
          />
          <span style={{ marginLeft: '8px' }}>Async</span>
        </div>
      </div>
      {selectedNode.data.agent && (
        <div className="property-group">
          <div className="property-label">Connected Agent</div>
          <Paragraph>{selectedNode.data.agent.name || selectedNode.data.agent.id}</Paragraph>
        </div>
      )}
    </>
  );

  const renderFunctionToolProperties = () => (
    <>
      <div className="property-group">
        <div className="property-label">Name</div>
        <Input 
          value={selectedNode.data.name || ''} 
          onChange={handleNameChange}
          placeholder="Function name"
        />
      </div>
      <div className="property-group">
        <div className="property-label">Parameters</div>
        {(selectedNode.data.parameters || []).map((param, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '8px' }}>
            <Input 
              value={param.name} 
              disabled 
              style={{ marginRight: '8px', flex: 2 }}
            />
            <Select 
              value={param.type} 
              disabled 
              style={{ flex: 1, marginRight: '8px' }}
            >
              <Option value="str">str</Option>
              <Option value="int">int</Option>
              <Option value="float">float</Option>
              <Option value="bool">bool</Option>
              <Option value="list">list</Option>
              <Option value="dict">dict</Option>
            </Select>
            <Button 
              icon={<DeleteOutlined />} 
              onClick={() => handleRemoveParameter(index)}
              danger
            />
          </div>
        ))}
        
        <Space.Compact style={{ width: '100%', marginTop: '8px' }}>
          <Input
            placeholder="Parameter name"
            value={newParamName}
            onChange={(e) => setNewParamName(e.target.value)}
            style={{ flex: 2 }}
          />
          <Select
            value={newParamType}
            onChange={(value) => setNewParamType(value)}
            style={{ flex: 1 }}
          >
            <Option value="str">str</Option>
            <Option value="int">int</Option>
            <Option value="float">float</Option>
            <Option value="bool">bool</Option>
            <Option value="list">list</Option>
            <Option value="dict">dict</Option>
          </Select>
          <Button 
            icon={<PlusOutlined />} 
            onClick={handleAddParameter}
          />
        </Space.Compact>
      </div>
      <div className="property-group">
        <div className="property-label">Return Type</div>
        <Select
          style={{ width: '100%' }}
          value={selectedNode.data.returnType || 'str'}
          onChange={handleReturnTypeChange}
        >
          <Option value="str">str</Option>
          <Option value="int">int</Option>
          <Option value="float">float</Option>
          <Option value="bool">bool</Option>
          <Option value="list">list</Option>
          <Option value="dict">dict</Option>
          <Option value="None">None</Option>
        </Select>
      </div>
      <div className="property-group">
        <div className="property-label">Implementation</div>
        <TextArea
          rows={6}
          value={selectedNode.data.implementation || ''}
          onChange={handleImplementationChange}
          placeholder="Function implementation"
        />
      </div>
    </>
  );

  let propertiesContent;
  switch (selectedNode.type) {
    case 'agent':
      propertiesContent = renderAgentProperties();
      break;
    case 'runner':
      propertiesContent = renderRunnerProperties();
      break;
    case 'functionTool':
      propertiesContent = renderFunctionToolProperties();
      break;
    default:
      propertiesContent = <Empty description="Unknown node type" />;
  }

  return (
    <div className="properties-panel">
      <Title level={4} className="panel-title">Properties</Title>
      <Paragraph style={{ marginBottom: '16px' }}>
        Node Type: <strong>{selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}</strong>
      </Paragraph>
      {propertiesContent}
    </div>
  );
};

export default PropertiesPanel;