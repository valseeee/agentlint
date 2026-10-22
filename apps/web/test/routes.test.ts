import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "../app/api/analyze/route";
import { GET } from "../app/api/status/route";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("analysis input", () => {
  it.each(["{", "null", "[]", "42", '{"repository":42}', '{"demo":"false"}'])(
    "rejects invalid input with HTTP 400: %s",
    async (body) => {
      const fetch = vi.fn();
      vi.stubGlobal("fetch", fetch);
      const response = await POST(new Request("http://localhost/api/analyze", { method: "POST", body }));
      expect(response.status).toBe(400);
      expect((await response.json()).code).toBe("INVALIDREPOSITORY");
      expect(fetch).not.toHaveBeenCalled();
    },
  );

  it("still analyzes the demo without network access", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const response = await POST(new Request("http://localhost/api/analyze", {
      method: "POST", body: JSON.stringify({ demo: true, locale: "en-US" }),
    }));
    expect(response.status).toBe(200);
    expect((await response.json()).repository.source).toBe("demo");
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("connection diagnostics", () => {
  it("does not probe the network unless requested", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    expect((await GET(new Request("http://localhost/api/status"))).status).toBe(200);
    expect(fetch).not.toHaveBeenCalled();
  });

  it("starts all probes before waiting for any response", async () => {
    const resolvers: Array<(response: Response) => void> = [];
    const fetch = vi.fn(() => new Promise<Response>((resolve) => resolvers.push(resolve)));
    vi.stubGlobal("fetch", fetch);
    const pending = GET(new Request("http://localhost/api/status?test=1"));
    const started = fetch.mock.calls.length;
    // Resolve even when this assertion fails, so a regression leaves no pending probes.
    for (const resolve of resolvers) resolve(new Response(null, { status: 200 }));
    expect(started).toBe(3);
    const payload = await (await pending).json();
    expect(payload.checks.github.ok).toBe(true);
    expect(payload.checks.archive.ok).toBe(true);
    expect(payload.checks.api.ok).toBe(true);
  });
});
