import { describe, it, expect } from "vitest";
import { Indexforge } from "../src/core.js";
describe("Indexforge", () => {
  it("init", () => { expect(new Indexforge().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Indexforge(); await c.generate(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Indexforge(); await c.generate(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
