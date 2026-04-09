import { useState, useEffect, useRef } from "react";

const normalize = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const LEVELS = [
  {
    id: "superamigui",
    title: "¿Quién es el superamigui?",
    emoji: "🦸",
    color: "#7F77DD",
    bg: "#EEEDFE",
    puzzles: [
      { emojis: "🍗🌶️", answer: ["marce"], display: "Marce" },
      { emojis: "🎨👩‍🎨", answer: ["moni"], display: "Moni" },
      { emojis: "🐕🐶🐩", answer: ["fer"], display: "Fer" },
      { emojis: "🥟", answer: ["jessy", "jessi", "jessie"], display: "Jessy" },
      { emojis: "👨‍💼🏛️📐", answer: ["hugo"], display: "Hugo" },
      { emojis: "💻🖥️", answer: ["mark"], display: "Mark" },
    ]
  },
  {
    id: "amigui",
    title: "Amigui del superamigui",
    emoji: "👯",
    color: "#0F6E56",
    bg: "#E1F5EE",
    puzzles: [
      { emojis: "🌴", answer: ["george"], display: "George" },
      { emojis: "🦶👃💨🩴", answer: ["jocy"], display: "Jocy" },
      { emojis: "🧑🦊🧑", answer: ["carlina"], display: "Carlina" },
      { emojis: "💂🌈", answer: ["armigay", "army gay", "armando"], display: "Armigay / Armando" },
      { emojis: "🗿", answer: ["david cabezas", "david"], display: "David Cabezas" },
      { emojis: "🦊🧙‍♀️", answer: ["huevo"], display: "Huevo" },
      { emojis: "😎🍑✨", answer: ["sexy guero", "sexy güero"], display: "Sexy Güero" },
      { emojis: "🐓", answer: ["gallo"], display: "Gallo" },
      { emojis: "🏔️🕳️", answer: ["cuevas"], display: "Cuevas" },
      { emojis: "🥥", answer: ["coco", "armigay", "army gay", "armando"], display: "Coco / Armigay" },
    ]
  },
  {
    id: "simpsons",
    title: "Los Simpsons",
    emoji: "🍩",
    color: "#BA7517",
    bg: "#FAEEDA",
    puzzles: [
      { emojis: "🙏🦸🏻‍♂️", answer: ["salvame superman"], display: "Sálvame superman" },
      { emojis: "❌📺❌🍺👨‍🦲💥🧠", answer: ["sin tele y sin cerveza"], display: "Sin tele y sin cerveza homero pierde la cabeza" },
      { emojis: "🧐✨🇫🇷", answer: ["que elegancia la de francia"], display: "Qué elegancia la de francia" },
      { emojis: "🐱🐱🐱🐱", answer: ["miau"], display: "miau miau miau miau" },
      { emojis: "🫱🫲", answer: ["excelente"], display: "Exceleeeeent" },
      { emojis: "🍺🍻🍺", answer: ["la cerveza el origen y solucion de todos los problemas de la vida", "la cerveza el origen y solucion"], display: "La cerveza..." },
      { emojis: "🦕👴", answer: ["en mis tiempos"], display: "En mis tiempos..." },
      { emojis: "", answer: ["excelente"], display: "Excelente" },
      { emojis: "🛋️📺🍕", answer: ["no pasa nada"], display: "No pasa nada" },
      { emojis: "🐍🎶", answer: ["serpentina"], display: "Serpentina" },
    ]
  },
  {
    id: "albur",
    title: "Albur (AI malísimos)",
    emoji: "🌶️",
    color: "#993C1D",
    bg: "#FAECE7",
    puzzles: [
      { emojis: "🍆💦😮", answer: ["metele hasta el fondo"], display: "Métele hasta el fondo" },
      { emojis: "🐓🌮🔄", answer: ["chinga tu madre"], display: "Chinga tu madre" },
      { emojis: "🍑👋💥", answer: ["que nalgotas"], display: "¡Qué nalgotas!" },
      { emojis: "🦆🛏️", answer: ["te la pato"], display: "Te la pato" },
      { emojis: "🐟💨🍑", answer: ["me la pela"], display: "Me la pela" },
      { emojis: "🌮🍆🏃", answer: ["agarra esa"], display: "Agarra esa" },
      { emojis: "👅🍆💦", answer: ["mamala"], display: "Mámalon" },
      { emojis: "🖐️🍑🔁", answer: ["nalgueame"], display: "Nalgüeame" },
      { emojis: "🍆📏😏", answer: ["que tan grande la quieres"], display: "¿Qué tan grande la quieres?" },
      { emojis: "🌮🍆🙏", answer: ["ya metelon"], display: "Ya mételo" },
    ]
  }
];

const StarDisplay = ({ count, max = 3 }) => (
  <span style={{ fontSize: 18, letterSpacing: 2 }}>
    {Array.from({ length: max }, (_, i) => (
      <span key={i} style={{ opacity: i < count ? 1 : 0.2 }}>⭐</span>
    ))}
  </span>
);

export default function App() {
  const [screen, setScreen] = useState("home"); // home | level | puzzle | result | levelDone
  const [levelIdx, setLevelIdx] = useState(null);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [stars, setStars] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintState, setHintState] = useState(0); // 0=none,1=words,2=letters,3=initials
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [levelStars, setLevelStars] = useState([]); // stars per puzzle
  const [allResults, setAllResults] = useState({}); // levelId -> total stars
  const inputRef = useRef();

  const level = levelIdx !== null ? LEVELS[levelIdx] : null;
  const puzzle = level ? level.puzzles[puzzleIdx] : null;

  useEffect(() => {
    if (screen === "puzzle" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [screen, puzzleIdx]);

  const startLevel = (idx) => {
    setLevelIdx(idx);
    setPuzzleIdx(0);
    setStars(3);
    setHintsUsed(0);
    setHintState(0);
    setInput("");
    setLevelStars([]);
    setScreen("puzzle");
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    if (!puzzle) return;
    const norm = normalize(val);
    if (puzzle.answer.some(a => normalize(a) === norm)) {
      setCelebrate(true);
      setTimeout(() => {
        setCelebrate(false);
        const earned = stars;
        const newLevelStars = [...levelStars, earned];
        if (puzzleIdx + 1 >= level.puzzles.length) {
          const total = newLevelStars.reduce((a, b) => a + b, 0);
          setAllResults(r => ({ ...r, [level.id]: total }));
          setLevelStars(newLevelStars);
          setScreen("levelDone");
        } else {
          setLevelStars(newLevelStars);
          setPuzzleIdx(i => i + 1);
          setStars(3);
          setHintsUsed(0);
          setHintState(0);
          setInput("");
        }
      }, 900);
    }
  };

  const useHint = () => {
    if (hintState >= 3) return;
    const next = hintState + 1;
    setHintState(next);
    setHintsUsed(h => h + 1);
    setStars(s => Math.max(1, s - 1));
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const getHintDisplay = () => {
    if (!puzzle || hintState === 0) return null;
    const words = puzzle.display.split(/\s+/);
    if (hintState === 1) return words.map(w => "▢".repeat(w.length)).join("  ");
    if (hintState === 2) return words.map(w => `[${w.length}]`).join("  ");
    if (hintState === 3) return words.map(w => w[0] + "_".repeat(w.length - 1)).join("  ");
  };

  const accentColor = level?.color || "#7F77DD";
  const bgColor = level?.bg || "#EEEDFE";

  // HOME
  if (screen === "home") {
    return (
      <div style={{ padding: "2rem 1rem", maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🧩</div>
          <h1 style={{ fontSize: 26, fontWeight: 500, margin: 0 }}>Emojigma</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginTop: 6 }}>
            Adivina la frase escondida en los emojis
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {LEVELS.map((lv, i) => {
            const res = allResults[lv.id];
            const maxStars = lv.puzzles.length * 3;
            return (
              <button key={lv.id} onClick={() => startLevel(i)} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 16px", borderRadius: 14,
                border: `1.5px solid ${lv.color}30`,
                background: lv.bg, cursor: "pointer", textAlign: "left",
              }}>
                <span style={{ fontSize: 28 }}>{lv.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 15, color: lv.color }}>{lv.title}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                    {lv.puzzles.length} puzzles
                  </div>
                </div>
                {res !== undefined && (
                  <div style={{ fontSize: 12, color: lv.color, fontWeight: 500 }}>
                    {res}/{maxStars} ⭐
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // LEVEL DONE
  if (screen === "levelDone" && level) {
    const total = levelStars.reduce((a, b) => a + b, 0);
    const max = level.puzzles.length * 3;
    return (
      <div style={{ padding: "2rem 1rem", maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>{level.emoji}</div>
        <h2 style={{ fontWeight: 500, fontSize: 20, margin: "0 0 4px" }}>{level.title}</h2>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginTop: 4 }}>¡Nivel completado!</p>
        <div style={{ fontSize: 36, margin: "1.5rem 0 0.5rem" }}>
          {Array.from({ length: total }, (_, i) => <span key={i}>⭐</span>)}
        </div>
        <p style={{ fontSize: 18, fontWeight: 500, color: accentColor }}>{total} / {max} estrellas</p>
        <div style={{ margin: "1.5rem 0", display: "flex", flexDirection: "column", gap: 6 }}>
          {level.puzzles.map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "var(--color-background-secondary)", borderRadius: 8, fontSize: 14 }}>
              <span>{p.emojis}</span>
              <span style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>{p.display}</span>
              <StarDisplay count={levelStars[i]} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => startLevel(levelIdx)} style={{ padding: "10px 20px", borderRadius: 10, background: bgColor, border: `1.5px solid ${accentColor}40`, color: accentColor, fontWeight: 500, cursor: "pointer", fontSize: 14 }}>
            Repetir
          </button>
          <button onClick={() => setScreen("home")} style={{ padding: "10px 20px", borderRadius: 10, background: accentColor, border: "none", color: "#fff", fontWeight: 500, cursor: "pointer", fontSize: 14 }}>
            Menú principal
          </button>
        </div>
      </div>
    );
  }

  // PUZZLE
  if (screen === "puzzle" && puzzle) {
    const hint = getHintDisplay();
    return (
      <div style={{ padding: "1.5rem 1rem", maxWidth: 480, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "var(--color-text-secondary)" }}>←</button>
          <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            {puzzleIdx + 1} / {level.puzzles.length}
          </div>
          <StarDisplay count={stars} />
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: "var(--color-background-secondary)", borderRadius: 99, marginBottom: 24 }}>
          <div style={{ height: 4, background: accentColor, borderRadius: 99, width: `${((puzzleIdx) / level.puzzles.length) * 100}%`, transition: "width 0.3s" }} />
        </div>

        {/* Level label */}
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: accentColor, background: bgColor, padding: "3px 10px", borderRadius: 99 }}>
            {level.emoji} {level.title}
          </span>
        </div>

        {/* Emojis */}
        <div style={{
          textAlign: "center", fontSize: 52, lineHeight: 1.4,
          padding: "2rem 1rem", margin: "1rem 0",
          background: "var(--color-background-secondary)",
          borderRadius: 16, letterSpacing: 8,
          animation: celebrate ? "pulse 0.4s ease" : shake ? "shake 0.4s ease" : "none",
          border: celebrate ? `2px solid ${accentColor}60` : "2px solid transparent",
          transition: "border 0.3s"
        }}>
          {puzzle.emojis}
        </div>

        {/* Hint display */}
        {hint && (
          <div style={{ textAlign: "center", fontSize: 15, fontFamily: "monospace", color: accentColor, margin: "0 0 12px", letterSpacing: 2 }}>
            {hint}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          value={input}
          onChange={handleInput}
          placeholder="Escribe la frase..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          style={{
            width: "100%", fontSize: 16, padding: "14px 16px",
            borderRadius: 12, border: `1.5px solid ${celebrate ? accentColor : "var(--color-border-secondary)"}`,
            background: celebrate ? bgColor : "var(--color-background-secondary)",
            color: "var(--color-text-primary)", outline: "none",
            boxSizing: "border-box", transition: "border 0.2s, background 0.2s",
          }}
          disabled={celebrate}
        />

        {/* Hint button */}
        <div style={{ textAlign: "center", marginTop: 16 }}>
          {hintState < 3 ? (
            <button onClick={useHint} style={{
              background: "none", border: `1px solid var(--color-border-secondary)`,
              borderRadius: 10, padding: "8px 20px", fontSize: 13,
              color: "var(--color-text-secondary)", cursor: "pointer"
            }}>
              💡 Pista {hintState + 1} (−1 ⭐)
            </button>
          ) : (
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Sin más pistas</span>
          )}
        </div>

        {celebrate && (
          <div style={{ textAlign: "center", marginTop: 20, fontSize: 28 }}>
            🎉✅🎊
          </div>
        )}

        <style>{`
          @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
          @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        `}</style>
      </div>
    );
  }

  return null;
}