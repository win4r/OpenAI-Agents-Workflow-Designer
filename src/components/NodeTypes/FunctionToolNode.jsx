import { Input, Select, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import BaseNode from './BaseNode';
import { useState } from 'react';

const { Option } = Select;

const FunctionToolNode = ({ data, id, selected }) => {
  const [newParamName, setNewParamName] = useState('');
  const [newParamType, setNewParamType] = useState('str');

  const handleNameChange = (e) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, name: e.target.value });
    }
  };

  const handleReturnTypeChange = (value) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, returnType: value });
    }
  };

  const handleImplementationChange = (e) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, implementation: e.target.value });
    }
  };

  const handleAddParameter = () => {
    if (!newParamName.trim()) return;
    
    const newParam = {
      name: newParamName,
      type: newParamType
    };
    
    const updatedParams = [...(data.parameters || []), newParam];
    
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, parameters: updatedParams });
    }
    
    setNewParamName('');
    setNewParamType('str');
  };

  const handleRemoveParameter = (index) => {
    const updatedParams = [...(data.parameters || [])];
    updatedParams.splice(index, 1);
    
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, parameters: updatedParams });
    }
  };

  return (
    <BaseNode
      data={data}
      id={id}
      selected={selected}
      type="function-tool"
    >
      <div className="node-field">
        <div className="node-field-label">Name:</div>
        <Input
          size="small"
          value={data.name || ''}
          onChange={handleNameChange}
          placeholder="Function name"
        />
      </div>
      
      <div className="node-field">
        <div className="node-field-label">Parameters:</div>
        {(data.parameters || []).map((param, index) => (
          <div key={index} style={{ display: 'flex', marginBottom: '4px' }}>
            <Input 
              size="small" 
              value={param.name} 
              disabled 
              style={{ marginRight: '4px', flex: 2 }}
            />
            <Select 
              size="small" 
              value={param.type} 
              disabled 
              style={{ flex: 1, marginRight: '4px' }}
            >
              <Option value="str">str</Option>
              <Option value="int">int</Option>
              <Option value="float">float</Option>
              <Option value="bool">bool</Option>
              <Option value="list">list</Option>
              <Option value="dict">dict</Option>
            </Select>
            <Button 
              size="small" 
              icon={<DeleteOutlined />} 
              onClick={() => handleRemoveParameter(index)}
              danger
            />
          </div>
        ))}
        
        <Space.Compact style={{ width: '100%', marginTop: '4px' }}>
          <Input
            size="small"
            placeholder="Parameter name"
            value={newParamName}
            onChange={(e) => setNewParamName(e.target.value)}
            style={{ flex: 2 }}
          />
          <Select
            size="small"
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
            size="small" 
            icon={<PlusOutlined />} 
            onClick={handleAddParameter}
          />
        </Space.Compact>
      </div>
      
      <div className="node-field">
        <div className="node-field-label">Return Type:</div>
        <Select
          size="small"
          style={{ width: '100%' }}
          value={data.returnType || 'str'}
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
      
      <div className="node-field">
        <div className="node-field-label">Implementation:</div>
        <Input.TextArea
          rows={3}
          value={data.implementation || ''}
          onChange={handleImplementationChange}
          placeholder="Function implementation"
        />
      </div>
    </BaseNode>
  );
};

export default FunctionToolNode;