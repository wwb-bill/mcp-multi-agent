export interface Agent { id: string; role: string; capabilities: string[]; }
export interface Message { from: string; to: string; type: "task"|"handoff"|"broadcast"; payload: unknown; taskId?: string; }
export interface TaskResult { taskId: string; agentId: string; result: unknown; success: boolean; }
