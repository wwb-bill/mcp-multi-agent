import { describe, it, expect } from "vitest";
import { MultiAgentCoordinator } from "../src/coordinator.js";

describe("MultiAgentCoordinator", () => {
  it("sends message between agents", async () => {
    const mc = new MultiAgentCoordinator();
    mc.register({ id: "b", role: "worker", capabilities: ["search"] }, async (msg) => ({ echoed: msg.payload }));
    const r = await mc.send({ from: "a", to: "b", type: "task", payload: { q: "hello" } });
    expect(r.success).toBe(true);
  });

  it("fails when target not found", async () => {
    const r = await new MultiAgentCoordinator().send({ from: "a", to: "x", type: "task", payload: {} });
    expect(r.success).toBe(false);
  });

  it("handoff between agents", async () => {
    const mc = new MultiAgentCoordinator();
    mc.register({ id: "specialist", role: "expert", capabilities: ["analyze"] }, async (msg) => ({ result: "analyzed" }));
    const r = await mc.handoff("generalist", "specialist", { data: "complex" });
    expect(r.success).toBe(true);
  });

  it("broadcasts to all", async () => {
    const mc = new MultiAgentCoordinator();
    mc.register({ id: "a1", role: "w", capabilities: [] }, async () => "ok");
    mc.register({ id: "a2", role: "w", capabilities: [] }, async () => "ok");
    const results = await mc.broadcast("coordinator", { announcement: "hi" });
    expect(results).toHaveLength(2);
    expect(results.every(r => r.success)).toBe(true);
  });

  it("finds agent by capability", () => {
    const mc = new MultiAgentCoordinator();
    mc.register({ id: "searcher", role: "search", capabilities: ["web_search"] }, async () => ({}));
    expect(mc.findAgentByCapability("web_search")?.id).toBe("searcher");
    expect(mc.findAgentByCapability("nonexistent")).toBeUndefined();
  });

  it("tracks tasks", async () => {
    const mc = new MultiAgentCoordinator();
    mc.register({ id: "w", role: "w", capabilities: [] }, async () => "done");
    await mc.send({ from: "a", to: "w", type: "task", taskId: "t1", payload: {} });
    expect(mc.getTask("t1")?.success).toBe(true);
  });
});
