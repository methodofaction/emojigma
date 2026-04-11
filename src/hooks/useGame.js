import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { LEVELS } from "../data/levels.js";
import { normalize } from "../utils/normalize.js";
import {
  parseLocationHash,
  hashForGameState,
  normalizeHash,
  saveLevelResult,
  loadLevelResult,
} from "../utils/permalink.js";

export function useGame() {
  const [screen, setScreen] = useState("home");
  const [levelIdx, setLevelIdx] = useState(null);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [stars, setStars] = useState(3);
  const [hintState, setHintState] = useState(0);
  const [input, setInput] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [levelStars, setLevelStars] = useState([]);
  const [allResults, setAllResults] = useState({});
  const [hashReady, setHashReady] = useState(false);
  const inputRef = useRef();
  const revealTimeoutRef = useRef(null);

  const level = levelIdx !== null ? LEVELS[levelIdx] : null;
  const puzzle = level ? level.puzzles[puzzleIdx] : null;

  const clearRevealTimeout = useCallback(() => {
    if (revealTimeoutRef.current) {
      clearTimeout(revealTimeoutRef.current);
      revealTimeoutRef.current = null;
    }
  }, []);

  const applyRouteFromHash = useCallback(() => {
    clearRevealTimeout();
    const route = parseLocationHash();

    if (route.kind === "home") {
      setAnswerRevealed(false);
      setCelebrate(false);
      setScreen("home");
      return;
    }

    if (route.kind === "done") {
      const idx = LEVELS.findIndex((l) => l.id === route.levelId);
      if (idx === -1) {
        setScreen("home");
        return;
      }
      const lv = LEVELS[idx];
      const stored = loadLevelResult(route.levelId);
      if (!stored || stored.length !== lv.puzzles.length) {
        setScreen("home");
        return;
      }
      setLevelIdx(idx);
      setLevelStars(stored);
      setAnswerRevealed(false);
      setCelebrate(false);
      setScreen("levelDone");
      return;
    }

    if (route.kind === "puzzle") {
      const idx = LEVELS.findIndex((l) => l.id === route.levelId);
      if (idx === -1) {
        setScreen("home");
        return;
      }
      const lv = LEVELS[idx];
      const maxStage = lv.puzzles.length;
      const stage = Math.min(Math.max(1, route.stage), maxStage);
      const pIdx = stage - 1;

      setLevelIdx(idx);
      setPuzzleIdx(pIdx);
      setLevelStars(Array(pIdx).fill(0));
      setStars(3);
      setHintState(0);
      setInput("");
      setAnswerRevealed(false);
      setCelebrate(false);
      setScreen("puzzle");
    }
  }, [clearRevealTimeout]);

  useEffect(() => {
    return () => {
      clearRevealTimeout();
    };
  }, [clearRevealTimeout]);

  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot URL → state hydration on mount
    applyRouteFromHash();
    setHashReady(true);
  }, [applyRouteFromHash]);

  useLayoutEffect(() => {
    const onHashChange = () => {
      applyRouteFromHash();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [applyRouteFromHash]);

  useEffect(() => {
    if (!hashReady) return;
    const levelId = level?.id ?? null;
    const target = hashForGameState(screen, levelId, puzzleIdx);
    const current = normalizeHash(window.location.hash || "#/");
    if (normalizeHash(target) !== current) {
      window.history.replaceState(null, "", target);
    }
  }, [screen, level?.id, puzzleIdx, hashReady]);

  useEffect(() => {
    if (screen === "puzzle" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [screen, puzzleIdx]);

  const startLevel = (idx) => {
    clearRevealTimeout();
    setLevelIdx(idx);
    setPuzzleIdx(0);
    setStars(3);
    setHintState(0);
    setInput("");
    setAnswerRevealed(false);
    setLevelStars([]);
    setScreen("puzzle");
  };

  const finishPuzzle = (earned) => {
    clearRevealTimeout();
    const newLevelStars = [...levelStars, earned];
    if (puzzleIdx + 1 >= level.puzzles.length) {
      const total = newLevelStars.reduce((a, b) => a + b, 0);
      setAllResults((r) => ({ ...r, [level.id]: total }));
      setLevelStars(newLevelStars);
      saveLevelResult(level.id, newLevelStars);
      setAnswerRevealed(false);
      setScreen("levelDone");
    } else {
      setLevelStars(newLevelStars);
      setPuzzleIdx((i) => i + 1);
      setStars(3);
      setHintState(0);
      setInput("");
      setAnswerRevealed(false);
    }
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (!puzzle || answerRevealed || celebrate) return;
    const norm = normalize(val);
    if (puzzle.answer.some((a) => normalize(a) === norm)) {
      setCelebrate(true);
      setTimeout(() => {
        setCelebrate(false);
        finishPuzzle(stars);
      }, 1200);
    }
  };

  const revealAnswer = () => {
    if (answerRevealed || celebrate || !puzzle) return;
    setAnswerRevealed(true);
    setStars(0);
    setInput(puzzle.display);
    clearRevealTimeout();
    revealTimeoutRef.current = setTimeout(() => {
      revealTimeoutRef.current = null;
      finishPuzzle(0);
    }, 3000);
  };

  const useHint = () => {
    if (answerRevealed || celebrate || hintState >= 1) return;
    setInput("");
    setHintState(1);
    setStars((s) => Math.max(1, s - 1));
  };

  const goHome = () => {
    clearRevealTimeout();
    setAnswerRevealed(false);
    setScreen("home");
  };

  const accentColor = level?.color || "#7F77DD";
  const bgColor = level?.bg || "#EEEDFE";

  return {
    screen,
    setScreen,
    goHome,
    levelIdx,
    level,
    puzzle,
    puzzleIdx,
    stars,
    input,
    inputRef,
    celebrate,
    answerRevealed,
    levelStars,
    allResults,
    hintState,
    startLevel,
    handleInput,
    revealAnswer,
    useHint,
    accentColor,
    bgColor,
  };
}
