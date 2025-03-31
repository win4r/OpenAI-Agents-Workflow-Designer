import { Input, Switch } from 'antd';
import BaseNode from './BaseNode';

const RunnerNode = ({ data, id, selected }) => {
  const handleInputChange = (e) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, input: e.target.value });
    }
  };

  const handleModeChange = (checked) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, isAsync: checked });
    }
  };

  return (
    <BaseNode
      data={data}
      id={id}
      selected={selected}
      type="runner"
    >
      <div className="node-field">
        <div className="node-field-label">Input:</div>
        <Input
          size="small"
          value={data.input || ''}
          onChange={handleInputChange}
          placeholder="Runner input"
        />
      </div>
      <div className="node-field">
        <div className="node-field-label">Execution Mode:</div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}>Sync</span>
          <Switch 
            checked={data.isAsync} 
            onChange={handleModeChange} 
            size="small"
          />
          <span style={{ marginLeft: '8px' }}>Async</span>
        </div>
      </div>
      
      {data.agent && (
        <div className="node-field">
          <div className="node-field-label">Connected Agent:</div>
          <div className="node-field-value">
            {data.agent.name || data.agent.id}
          </div>
        </div>
      )}
    </BaseNode>
  );
};

export default RunnerNode;