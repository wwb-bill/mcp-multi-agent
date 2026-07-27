# mcp-multi-agent

Multi-agent MCP coordination layer — orchestration, handoff, and message routing for Model Context Protocol agents.

## Overview

MCP Multi-Agent provides a coordination layer that enables multiple MCP-based agents to work together. It handles agent orchestration, handoff protocols, and intelligent message routing between agents.

## Features

- **Agent orchestration** — coordinate multiple MCP agents in a workflow
- **Handoff protocol** — seamless context transfer between agents
- **Message routing** — intelligent routing of tool calls and responses
- **TypeScript-first** — full type safety with TypeScript

## Install

```bash
npm install mcp-multi-agent
```

## Usage

```ts
import { Coordinator } from 'mcp-multi-agent';

const coordinator = new Coordinator({
  agents: ['researcher', 'writer', 'reviewer'],
});

// Route a task through multiple agents
const result = await coordinator.run('Research and summarize the latest AI papers');
```

## License

MIT
