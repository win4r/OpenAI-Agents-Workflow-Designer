import AgentNode from './AgentNode';
import RunnerNode from './RunnerNode';
import FunctionToolNode from './FunctionToolNode';

export const nodeTypes = {
  agent: AgentNode,
  runner: RunnerNode,
  functionTool: FunctionToolNode
};

export { AgentNode, RunnerNode, FunctionToolNode };