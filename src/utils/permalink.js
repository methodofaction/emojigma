import { LEVELS } from "../data/levels.js";

export const RESULTS_STORAGE_PREFIX = "emojigma:levelResults:";

export function saveLevelResult(levelId, stars) {
  try {
    sessionStorage.setItem(RESULTS_STORAGE_PREFIX + levelId, JSON.stringify(stars));
  } catch {
    /* ignore quota / private mode */
  }
}

export function loadLevelResult(levelId) {
  try {
    const raw = sessionStorage.getItem(RESULTS_STORAGE_PREFIX + levelId);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : null;
  } catch {
    return null;
  }
}

/** Read current window hash → route object */
export function parseLocationHash() {
  if (typeof window === "undefined") return { kind: "home" };
  const raw = window.location.hash.replace(/^#/, "").replace(/^\//, "");
  if (!raw) return { kind: "home" };

  const parts = raw.split("/").filter(Boolean);
  const first = parts[0];
  if (first === "home") return { kind: "home" };

  const level = LEVELS.find((l) => l.id === first);
  if (!level) return { kind: "home" };

  const second = parts[1];
  if (second === "done" || second === "results") {
    return { kind: "done", levelId: first };
  }

  let stage = 1;
  if (second != null && /^\d+$/.test(second)) {
    stage = parseInt(second, 10);
  }

  return { kind: "puzzle", levelId: first, stage };
}

/** Target hash for current game screen (leading #). */
export function hashForGameState(screen, levelId, puzzleIdx) {
  if (screen === "home" || !levelId) return "#/";
  if (screen === "levelDone") return `#/${levelId}/done`;
  if (puzzleIdx <= 0) return `#/${levelId}`;
  return `#/${levelId}/${puzzleIdx + 1}`;
}

export function normalizeHash(h) {
  if (!h || h === "#") return "#/";
  return h.startsWith("#") ? h : `#${h}`;
}
