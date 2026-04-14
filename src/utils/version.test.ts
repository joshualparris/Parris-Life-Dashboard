import { describe, it, expect } from "vitest";
import { getMajor } from "./version";

describe("getMajor", () => {
  it("parses v-prefixed version", () => {
    expect(getMajor("v24.13.0")).toBe(24);
  });
  it("parses plain version", () => {
    expect(getMajor("18.3.1")).toBe(18);
  });
  it("handles invalid input", () => {
    expect(getMajor("")).toBe(0);
  });
});
