import { LEVELS } from "../data/levels.js";

export function HomeScreen({ allResults, onStartLevel }) {
  return (
    <div style={{ padding: "2rem 1rem", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{"\u{1f9e9}"}</div>
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
            <button
              key={lv.id}
              onClick={() => onStartLevel(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                borderRadius: 14,
                border: `1.5px solid ${lv.color}30`,
                background: lv.bg,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 28 }}>{lv.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 15, color: lv.color }}>{lv.title}</div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>
                  {lv.puzzles.length} puzzles
                </div>
              </div>
              {res !== undefined && (
                <div style={{ fontSize: 12, color: lv.color, fontWeight: 500 }}>
                  {res}/{maxStars} {"\u2b50"}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
