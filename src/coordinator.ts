import type { Agent, Message, TaskResult } from "./types.js";

export class MultiAgentCoordinator {
  private agents = new Map<string, Agent>();
  private tasks = new Map<string, TaskResult>();
  private handlers = new Map<string, (msg: Message) => Promise<unknown>>();

  register(agent: Agent, handler: (msg: Message) => Promise<unknown>): void {
    this.agents.set(agent.id, agent);
    this.handlers.set(agent.id, handler);
  }

  async send(msg: Message): Promise<TaskResult> {
    const handler = this.handlers.get(msg.to);
    if (!handler) return { taskId: msg.taskId || "", agentId: msg.to, result: undefined, success: false };

    try {
      const result = await handler(msg);
      const tr: TaskResult = { taskId: msg.taskId || "", agentId: msg.to, result, success: true };
      this.tasks.set(tr.taskId, tr);
      return tr;
    } catch (e) {
      const tr: TaskResult = { taskId: msg.taskId || "", agentId: msg.to, result: (e as Error).message, success: false };
      return tr;
    }
  }

  async handoff(from: string, to: string, payload: unknown): Promise<TaskResult> {
    return this.send({ from, to, type: "handoff", payload });
  }

  async broadcast(from: string, payload: unknown): Promise<TaskResult[]> {
    const results: TaskResult[] = [];
    for (const [id] of this.agents) {
      if (id !== from) {
        results.push(await this.send({ from, to: id, type: "broadcast", payload }));
      }
    }
    return results;
  }

  findAgentByCapability(capability: string): Agent | undefined {
    return [...this.agents.values()].find(a => a.capabilities.includes(capability));
  }

  agentCount(): number { return this.agents.size; }
  getTask(taskId: string): TaskResult | undefined { return this.tasks.get(taskId); }
}
