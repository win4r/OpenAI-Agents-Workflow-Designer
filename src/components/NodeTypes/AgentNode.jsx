import { Input } from 'antd';
import BaseNode from './BaseNode';

const AgentNode = ({ data, id, selected }) => {
  const handleNameChange = (e) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, name: e.target.value });
    }
  };

  const handleInstructionsChange = (e) => {
    if (data.onNodeDataChange) {
      data.onNodeDataChange(id, { ...data, instructions: e.target.value });
    }
  };

  return (
    <BaseNode
      data={data}
      id={id}
      selected={selected}
      type="agent"
    >
      <div className="node-field">
        <div className="node-field-label">Name:</div>
        <Input
          size="small"
          value={data.name || ''}
          onChange={handleNameChange}
          placeholder="Agent name"
        />
      </div>
      <div className="node-field">
        <div className="node-field-label">Instructions:</div>
        <Input.TextArea
          rows={3}
          value={data.instructions || ''}
          onChange={handleInstructionsChange}
          placeholder="Agent instructions"
        />
      </div>
      
      {data.handoffs && data.handoffs.length > 0 && (
        <div className="node-field">
          <div className="node-field-label">Handoffs:</div>
          <div className="node-field-value">
            {data.handoffs.map(handoff => (
              <div key={handoff.id} className="node-field-tag">
                {handoff.name || handoff.id}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {data.tools && data.tools.length > 0 && (
        <div className="node-field">
          <div className="node-field-label">Tools:</div>
          <div className="node-field-value">
            {data.tools.map(tool => (
              <div key={tool.id} className="node-field-tag">
                {tool.name || tool.id}
              </div>
            ))}
          </div>
        </div>
      )}
    </BaseNode>
  );
};

export default AgentNode;