import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const BaseNode = ({ 
  data, 
  id, 
  selected, 
  type, 
  sourcePosition = Position.Bottom, 
  targetPosition = Position.Top,
  children 
}) => {
  const handleNodeClick = useCallback(() => {
    if (data.onNodeClick) {
      data.onNodeClick(id, type);
    }
  }, [data, id, type]);

  return (
    <Card 
      className={`${type}-node`}
      style={{ 
        width: data.width || 220, 
        border: selected ? '1px solid #1890ff' : '1px solid #d9d9d9',
      }}
      bodyStyle={{ padding: '0' }}
      onClick={handleNodeClick}
    >
      <div className="node-header">
        <Title level={5} style={{ margin: 0 }}>
          {data.label}
        </Title>
      </div>
      <div className="node-content">
        {children}
      </div>
      
      {data.isSource !== false && (
        <Handle
          type="source"
          position={sourcePosition}
          style={{ bottom: -4, background: '#778899' }}
          isConnectable={data.isConnectable}
        />
      )}
      
      {data.isTarget !== false && (
        <Handle
          type="target"
          position={targetPosition}
          style={{ top: -4, background: '#778899' }}
          isConnectable={data.isConnectable}
        />
      )}
    </Card>
  );
};

export default BaseNode;