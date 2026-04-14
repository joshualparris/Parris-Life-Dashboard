import { describe, it, expect } from "vitest";
import { scenes, SAVE_KEY, computeCharacterClass, type Scene } from "./page";

function validateSceneGraph(s: Record<string, Scene>) {
  // all choice targets exist
  for (const [id, scene] of Object.entries(s)) {
    const choices = scene.choices({ corruption: 0, truth: 0, flags: [], visited: [] });
    for (const ch of choices) {
      expect(typeof ch.label).toBe("string");
      expect(typeof ch.to).toBe("string");
      // target should be present in graph (endings are also scenes)
      expect(s[ch.to]).toBeTruthy();
    }
  }
}

describe("Corporate Game logic", () => {
  it("has a valid SAVE_KEY", () => {
    expect(SAVE_KEY).toBe("corporate-game-save-v2");
  });

  it("scene graph: all choices point to valid scenes", () => {
    validateSceneGraph(scenes);
  });

  it("foyer scene offers three choices", () => {
    const foyer = scenes["foyer"];
    const choices = foyer.choices({ corruption: 0, truth: 0, flags: [], visited: [] });
    expect(choices.length).toBeGreaterThanOrEqual(3);
    const labels = choices.map((c) => c.label.toLowerCase());
    expect(labels.some((l) => l.includes("diagnostics"))).toBe(true);
    expect(labels.some((l) => l.includes("archive"))).toBe(true);
    expect(labels.some((l) => l.includes("contact"))).toBe(true);
  });

  it("class inference from visited path", () => {
    expect(computeCharacterClass(["diagnostics"])).toBe("Technician");
    expect(computeCharacterClass(["archive"])).toBe("Archivist");
    expect(computeCharacterClass(["contact"])).toBe("Witness");
    expect(computeCharacterClass(["mirror"])).toBe("Witness");
    expect(computeCharacterClass(["core"])).toBe("Caretaker");
    expect(computeCharacterClass([])).toBe("Visitor");
  });

  it("endings exist and are reachable", () => {
    expect(scenes["endingSeal"]).toBeTruthy();
    expect(scenes["endingJoin"]).toBeTruthy();
    expect(scenes["endingRewrite"]).toBeTruthy();
    const mirrorChoices = scenes["mirror"].choices({ corruption: 0, truth: 0, flags: [], visited: [] });
    const toTargets = new Set(mirrorChoices.map((c) => c.to));
    expect(toTargets.has("core")).toBe(true);
    expect(toTargets.has("endingSeal")).toBe(true);
    expect(toTargets.has("endingJoin")).toBe(true);
  });
});
