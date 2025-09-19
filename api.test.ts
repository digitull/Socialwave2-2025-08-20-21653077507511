import { expect } from "expect";
import { _enforceBrandVibeOnContentPackage } from "./api";

// Single, mission-critical test focused on Brand Vibe enforcement across generated content
async function testEnforceBrandVibeSanitization() {
  const dirtyPackage = {
    title: "As an AI — here's a take 😊",
    postText:
      "We can help — truly. As a language model, I think this will resonate! 😊😊",
    caption: "Beach days — pure joy 😊",
    hook: "Discover 30A — the coastal calm you’ve been craving 😊",
    callToAction: "Plan your escape — see our guide 😊",
    hashtags: {
      twitter: ["#30A😊", "#BeachHappy"],
      instagram: ["#LifeShines😊", "#EmeraldCoast"],
      linkedin: ["#Florida—Travel"],
      facebook: ["#Local—Guide"],
      tiktok: ["#30A—Vibes"]
    },
    platformStrategies: [
      {
        platform: "Twitter",
        strategy: "Be helpful — concise and warm 😊",
        optimizedText: "Sunrise at Grayton — glassy Gulf, soft breeze 😊",
        bestTimes: ["9:00 AM"],
        viralityScore: 8
      }
    ],
    optimizationTips: [
      "Avoid AI-sounding phrases — keep it human 😊",
      "Lead with a visual — then a clear invite 😊"
    ],
    notes: "[As an AI], I'm here to help — but keep it human 😊",
  } as const;

  const cleaned = _enforceBrandVibeOnContentPackage(dirtyPackage);
  const serialized = JSON.stringify(cleaned);

  // Must remove emojis
  expect(/[\u{1F300}-\u{1FAFF}]/u.test(serialized)).toBe(false);
  expect(/[\u2600-\u27BF]/.test(serialized)).toBe(false);

  // Must remove AI disclaimers
  expect(/as an ai/i.test(serialized)).toBe(false);
  expect(/as a language model/i.test(serialized)).toBe(false);

  // Must not contain em/en dashes
  expect(/[—–]/.test(serialized)).toBe(false);

  // Should still preserve meaningful text (non-empty title and postText)
  const parsed = JSON.parse(serialized) as typeof cleaned;
  expect(typeof parsed.title).toBe("string");
  expect(parsed.title.length).toBeGreaterThan(0);
  expect(typeof parsed.postText).toBe("string");
  expect(parsed.postText.length).toBeGreaterThan(0);
}

export async function _runApiTests() {
  const result: { passedTests: string[]; failedTests: { name: string; error: string }[] } = {
    passedTests: [],
    failedTests: [],
  };

  const testFunctions = [testEnforceBrandVibeSanitization];

  for (const testFunction of testFunctions) {
    try {
      await testFunction();
      result.passedTests.push(testFunction.name);
    } catch (error) {
      result.failedTests.push({
        name: testFunction.name,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return result;
}
