# [🚀观看我的哔哩哔哩视频](https://space.bilibili.com/3493277319825652)

# OpenAI Agents Workflow Designer

### video(视频):https://youtu.be/KQULGx6wjco
### Demo: https://x.com/AISuperDomain/status/1906739439319257495
### 我的微信: stoeng

[English](#english) | [中文](#中文)

![OpenAI Agents Workflow Designer](https://img.shields.io/badge/OpenAI-Agents_Workflow_Designer-412991)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite&logoColor=white)
![ReactFlow](https://img.shields.io/badge/ReactFlow-Latest-ff0072)
![Ant Design](https://img.shields.io/badge/Ant_Design-Latest-0170FE?logo=ant-design&logoColor=white)

<a id="english"></a>
## 🌟 Overview

OpenAI Agents Workflow Designer is a visual interface that allows users to create OpenAI Agents workflows through a drag-and-drop component approach, and generate corresponding code. This tool simplifies the process of designing complex agent systems with multiple agents, function tools, and runners.

### ✨ Key Features

- **Visual Workflow Design**: Drag and drop components to create agent workflows
- **Component Configuration**: Configure agent names, instructions, function parameters, etc.
- **Relationship Establishment**: Connect components to establish relationships (handoffs, tools, execution)
- **Code Generation**: Generate runnable OpenAI Agents SDK code
- **Intuitive Interface**: User-friendly interface with clear visual cues

### 🛠️ Technology Stack

- **Frontend Framework**: React 18+
- **Workflow Editor**: React Flow
- **UI Component Library**: Ant Design
- **State Management**: React Hooks
- **Build Tool**: Vite

## 📋 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/openai-agents-workflow-designer.git
cd openai-agents-workflow-designer

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🚀 Usage Guide

1. **Add Components**:
   - Drag components from the left panel to the canvas
   - Available components: Agent, Runner, Function Tool

2. **Configure Components**:
   - Click on a component to view and edit its properties in the right panel
   - Set names, instructions, parameters, etc.

3. **Establish Connections**:
   - Connect components by dragging from one node's handle to another
   - Valid connections:
     - Agent → Agent: Handoff relationship
     - Function → Agent: Tool relationship
     - Agent → Runner: Execution relationship

4. **Generate Code**:
   - Click the "Generate Code" button to create OpenAI Agents SDK code
   - Copy the generated code to use in your Python projects

## 🧩 Component Types

### Agent Node
- **Purpose**: Represents an OpenAI Agent
- **Properties**:
  - Name: Agent identifier
  - Instructions: Agent behavior instructions
  - Handoffs: Connected agents (automatically updated)
  - Tools: Connected function tools (automatically updated)

### Runner Node
- **Purpose**: Executes an agent with input
- **Properties**:
  - Input: Text input for the agent
  - Execution Mode: Sync/Async toggle

### Function Tool Node
- **Purpose**: Custom function tool for agents
- **Properties**:
  - Name: Function name
  - Parameters: Function parameters with types
  - Return Type: Function return type
  - Implementation: Function code

## 📝 Example Workflow

1. Create an Agent node and configure its name and instructions
2. Create a Function Tool node and configure its parameters and implementation
3. Connect the Function Tool to the Agent (establishes a tool relationship)
4. Create a Runner node and configure its input
5. Connect the Agent to the Runner (establishes an execution relationship)
6. Generate code to see the complete OpenAI Agents SDK implementation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<a id="中文"></a>
## 🌟 概述

OpenAI Agents 工作流设计器是一个可视化界面，允许用户通过拖放组件方式创建OpenAI Agents工作流，并生成对应的代码。这个工具简化了设计复杂代理系统（包含多个代理、函数工具和运行器）的过程。

### ✨ 主要特点

- **可视化工作流设计**：通过拖放组件创建代理工作流
- **组件配置**：配置代理名称、指令、函数参数等
- **关系建立**：连接组件以建立关系（交接、工具、执行）
- **代码生成**：生成可运行的OpenAI Agents SDK代码
- **直观界面**：用户友好的界面，具有清晰的视觉提示

### 🛠️ 技术栈

- **前端框架**：React 18+
- **工作流编辑器**：React Flow
- **UI组件库**：Ant Design
- **状态管理**：React Hooks
- **构建工具**：Vite

## 📋 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/openai-agents-workflow-designer.git
cd openai-agents-workflow-designer

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 🚀 使用指南

1. **添加组件**：
   - 从左侧面板拖动组件到画布
   - 可用组件：Agent（代理）、Runner（运行器）、Function Tool（函数工具）

2. **配置组件**：
   - 点击组件查看并在右侧面板编辑其属性
   - 设置名称、指令、参数等

3. **建立连接**：
   - 通过从一个节点的连接点拖动到另一个节点来建立连接
   - 有效连接：
     - Agent → Agent：交接关系
     - Function → Agent：工具关系
     - Agent → Runner：执行关系

4. **生成代码**：
   - 点击"生成代码"按钮创建OpenAI Agents SDK代码
   - 复制生成的代码在Python项目中使用

## 🧩 组件类型

### Agent节点
- **用途**：代表一个OpenAI Agent
- **属性**：
  - 名称：代理标识符
  - 指令：代理行为指令
  - 交接：连接的代理（自动更新）
  - 工具：连接的函数工具（自动更新）

### Runner节点
- **用途**：使用输入执行代理
- **属性**：
  - 输入：代理的文本输入
  - 执行模式：同步/异步切换

### Function Tool节点
- **用途**：代理的自定义函数工具
- **属性**：
  - 名称：函数名称
  - 参数：带类型的函数参数
  - 返回类型：函数返回类型
  - 实现：函数代码

## 📝 示例工作流

1. 创建一个Agent节点并配置其名称和指令
2. 创建一个Function Tool节点并配置其参数和实现
3. 将Function Tool连接到Agent（建立工具关系）
4. 创建一个Runner节点并配置其输入
5. 将Agent连接到Runner（建立执行关系）
6. 生成代码以查看完整的OpenAI Agents SDK实现

## 🤝 贡献

欢迎贡献！请随时提交Pull Request。
