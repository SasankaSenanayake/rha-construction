import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadContentDir } from "@/lib/content/fs-utils";
import { projectSchema } from "@/lib/content/schema";

const FIXTURES_DIR = path.join(process.cwd(), "__tests__/fixtures");

describe("loadContentDir", () => {
  it("parses a valid content file into a typed object", () => {
    const results = loadContentDir("valid-projects", projectSchema, FIXTURES_DIR);
    expect(results).toHaveLength(1);
    expect(results[0]?.slug).toBe("sample");
    expect(results[0]?.translations.en.title).toBe("Sample");
  });

  it("throws a descriptive error when a locale translation is missing", () => {
    expect(() => loadContentDir("invalid-projects", projectSchema, FIXTURES_DIR)).toThrow(
      /invalid-projects\/missing-locale\.json/,
    );
  });
});
