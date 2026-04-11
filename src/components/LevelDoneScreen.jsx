import { StarDisplay } from "./StarDisplay.jsx";

export function LevelDoneScreen({
  level,
  levelStars,
  accentColor,
  bgColor,
  onRepeat,
  onHome,
}) {
  return (
    <div style={{ padding: "2rem 1rem", margin: "0 auto", textAlign: "center", width: "100%", boxSizing: "border-box" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>{level.emoji}</div>
      <h2 style={{ fontWeight: 500, fontSize: 20, margin: "0 0 4px" }}>{level.title}</h2>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginTop: 4 }}>¡Nivel completado!</p>

      <div
        style={{
          margin: "1.5rem 0",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
          width: "100%",
        }}
      >
        {level.puzzles.map((p, i) => (
          <div
            key={i}
            style={{
              maxWidth: 400,
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 16px",
              borderRadius: 14,
              background: "var(--color-background-secondary)",
              border: `1.5px solid ${accentColor}28`,
              textAlign: "left",
              containerType: "inline-size",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <span style={{ fontWeight: 500, fontSize: 15, color: accentColor, flex: 1, minWidth: 0 }}>
                {p.display}
              </span>
              <StarDisplay count={levelStars[i]} />
            </div>
            <div
              style={{
                fontSize: "15cqw",
                lineHeight: 1.35,
                letterSpacing: "2.25cqw",
                whiteSpace: "nowrap",
                overflowX: "auto",
                textAlign: "center",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {p.emojis}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={onRepeat}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: bgColor,
            border: `1.5px solid ${accentColor}40`,
            color: accentColor,
            fontWeight: 500,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Repetir
        </button>
        <button
          onClick={onHome}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: accentColor,
            border: "none",
            color: "#fff",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          Menú principal
        </button>
      </div>
    </div>
  );
}
