import { HomeScreen } from "./components/HomeScreen.jsx";
import { LevelDoneScreen } from "./components/LevelDoneScreen.jsx";
import { PuzzleScreen } from "./components/PuzzleScreen.jsx";
import { useGame } from "./hooks/useGame.js";

export default function App() {
  const {
    screen,
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
  } = useGame();

  if (screen === "home") {
    return <HomeScreen allResults={allResults} onStartLevel={startLevel} />;
  }

  if (screen === "levelDone" && level) {
    return (
      <LevelDoneScreen
        level={level}
        levelStars={levelStars}
        accentColor={accentColor}
        bgColor={bgColor}
        onRepeat={() => startLevel(levelIdx)}
        onHome={goHome}
      />
    );
  }

  if (screen === "puzzle" && puzzle) {
    return (
      <PuzzleScreen
        level={level}
        puzzle={puzzle}
        puzzleIdx={puzzleIdx}
        stars={stars}
        input={input}
        inputRef={inputRef}
        onInputChange={handleInput}
        celebrate={celebrate}
        answerRevealed={answerRevealed}
        accentColor={accentColor}
        bgColor={bgColor}
        onHome={goHome}
        onUseHint={useHint}
        onRevealAnswer={revealAnswer}
        hintState={hintState}
      />
    );
  }

  return null;
}
