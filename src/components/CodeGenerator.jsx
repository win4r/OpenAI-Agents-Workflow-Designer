import { useState } from 'react';
import { Modal, Button, Typography } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('python', python);

const { Title } = Typography;

const CodeGenerator = ({ visible, onClose, nodes, edges }) => {
  const [copied, setCopied] = useState(false);

  const generateCode = () => {
    // 收集节点信息
    const agentNodes = nodes.filter(node => node.type === 'agent');
    const runnerNodes = nodes.filter(node => node.type === 'runner');
    const functionNodes = nodes.filter(node => node.type === 'functionTool');
    
    // 收集连接信息
    const connections = {};
    edges.forEach(edge => {
      if (!connections[edge.source]) {
        connections[edge.source] = { targets: [] };
      }
      connections[edge.source].targets.push({
        id: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle
      });
    });
    
    // 生成导入语句
    let code = 'import asyncio\nfrom agents import Agent, Runner, function_tool\n\n';
    
    // 生成函数工具定义
    functionNodes.forEach(node => {
      const { name, parameters, returnType, implementation } = node.data;
      
      if (!name) return;
      
      code += '@function_tool\n';
      code += `def ${name}(`;
      
      // 添加参数
      if (parameters && parameters.length > 0) {
        code += parameters.map(param => `${param.name}: ${param.type}`).join(', ');
      }
      
      // 添加返回类型
      code += `)${returnType !== 'None' ? ' -> ' + returnType : ''}:\n`;
      
      // 添加实现
      if (implementation) {
        const implLines = implementation.split('\n');
        implLines.forEach(line => {
          code += `    ${line}\n`;
        });
      } else {
        code += '    pass\n';
      }
      
      code += '\n';
    });
    
    // 生成Agent定义
    const agentDefinitions = {};
    agentNodes.forEach(node => {
      const { id, data } = node;
      const { name, instructions } = data;
      
      if (!name) return;
      
      const varName = name.toLowerCase().replace(/\s+/g, '_');
      agentDefinitions[id] = varName;
      
      code += `${varName} = Agent(\n`;
      code += `    name="${name}",\n`;
      code += `    instructions="${instructions}",\n`;
      
      // 添加handoffs
      const handoffs = [];
      const tools = [];
      
      if (connections[id] && connections[id].targets) {
        connections[id].targets.forEach(target => {
          const targetNode = nodes.find(n => n.id === target.id);
          if (targetNode && targetNode.type === 'agent') {
            handoffs.push(agentDefinitions[target.id]);
          }
        });
      }
      
      // 查找连接到此Agent的Function Tools
      nodes.forEach(node => {
        if (node.type === 'functionTool' && connections[node.id]) {
          connections[node.id].targets.forEach(target => {
            if (target.id === id) {
              tools.push(node.data.name);
            }
          });
        }
      });
      
      if (handoffs.length > 0) {
        code += `    handoffs=[${handoffs.join(', ')}],\n`;
      }
      
      if (tools.length > 0) {
        code += `    tools=[${tools.join(', ')}],\n`;
      }
      
      code += ')\n\n';
    });
    
    // 生成Runner执行代码
    if (runnerNodes.length > 0) {
      const runnerNode = runnerNodes[0];
      const { isAsync, input } = runnerNode.data;
      
      let agentVar = '';
      
      // 查找连接到Runner的Agent
      if (connections) {
        Object.keys(connections).forEach(sourceId => {
          connections[sourceId].targets.forEach(target => {
            if (target.id === runnerNode.id) {
              const sourceNode = nodes.find(n => n.id === sourceId);
              if (sourceNode && sourceNode.type === 'agent') {
                agentVar = agentDefinitions[sourceId];
              }
            }
          });
        });
      }
      
      if (!agentVar && agentNodes.length > 0) {
        // 如果没有连接，使用第一个Agent
        agentVar = agentDefinitions[agentNodes[0].id];
      }
      
      if (agentVar) {
        if (isAsync) {
          code += 'async def main():\n';
          code += `    result = await Runner.run(${agentVar}, input="${input}")\n`;
          code += '    print(result.final_output)\n\n';
          code += "if __name__ == \"__main__\":\n";
          code += '    asyncio.run(main())\n';
        } else {
          code += `result = Runner.run_sync(${agentVar}, "${input}")\n`;
          code += 'print(result.final_output)\n';
        }
      }
    }
    
    return code;
  };

  const generatedCode = generateCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      title={<Title level={4}>Generated OpenAI Agents Code</Title>}
      open={visible}
      onCancel={onClose}
      width={800}
      className="code-modal"
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        <Button 
          key="copy" 
          type="primary" 
          icon={copied ? <CheckOutlined /> : <CopyOutlined />} 
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy Code'}
        </Button>
      ]}
    >
      <div className="code-container">
        <SyntaxHighlighter 
          language="python" 
          style={docco}
          showLineNumbers
          customStyle={{ fontSize: '14px' }}
        >
          {generatedCode}
        </SyntaxHighlighter>
      </div>
    </Modal>
  );
};

export default CodeGenerator;