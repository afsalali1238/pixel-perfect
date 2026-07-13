import { render, act } from "@testing-library/react";
import { ProgressProvider, useProgress } from "./progress";
import { describe, it, expect, beforeEach } from "vitest";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("ProgressProvider", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("manages progress state and export/import correctly", () => {
    let contextValue: any;
    const TestComponent = () => {
      contextValue = useProgress();
      return <div>Test</div>;
    };

    render(
      <ProgressProvider>
        <TestComponent />
      </ProgressProvider>
    );

    act(() => {
      contextValue.markCard("domain1:item1:0", "mastered");
    });

    expect(contextValue.getMastery("domain1:item1:0")).toBe("mastered");

    const exported = contextValue.exportProgress();
    expect(exported).toContain('"domain1:item1:0": "mastered"');

    act(() => {
      contextValue.importProgress(JSON.stringify({ "domain2:item2:0": "review" }));
    });

    expect(contextValue.getMastery("domain2:item2:0")).toBe("review");
    expect(contextValue.getMastery("domain1:item1:0")).toBeUndefined();
  });
});
