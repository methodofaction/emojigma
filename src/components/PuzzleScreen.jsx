import { getFirstLetterHint } from "../utils/hints.js";
import { StarDisplay } from "./StarDisplay.jsx";

export function PuzzleScreen({
  level,
  puzzle,
  puzzleIdx,
  stars,
  input,
  inputRef,
  onInputChange,
  celebrate,
  answerRevealed,
  accentColor,
  bgColor,
  onHome,
  onUseHint,
  onRevealAnswer,
  hintState,
}) {
  const answerWordCount = puzzle.display.trim().split(/\s+/).filter(Boolean).length;
  const letterHint = hintState === 1 && !answerRevealed ? getFirstLetterHint(puzzle) : null;
  const inputPlaceholder =
    letterHint ?? (answerWordCount === 1 ? "Escribe la palabra..." : "Escribe la frase...");

  const btnRow = {
    flex: "1 1 120px",
    maxWidth: 200,
    padding: "10px 16px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  };

  return (
    <div
      style={{
        padding: "1.5rem 1rem",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <button
          onClick={onHome}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: "var(--color-text-secondary)",
          }}
        >
          ←
        </button>
        <div style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
          {puzzleIdx + 1} / {level.puzzles.length}
        </div>
        <StarDisplay count={stars} />
      </div>

      <div
        style={{
          height: 4,
          background: "var(--color-background-secondary)",
          borderRadius: 99,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            height: 4,
            background: accentColor,
            borderRadius: 99,
            width: `${((puzzleIdx) / level.puzzles.length) * 100}%`,
            transition: "width 0.3s",
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: accentColor,
            background: bgColor,
            padding: "3px 10px",
            borderRadius: 99,
          }}
        >
          {level.emoji} {level.title}
        </span>
      </div>

      <div
        style={{
          textAlign: "center",
          fontSize: "15cqw",
          lineHeight: 1.4,
          padding: "2rem 1rem",
          margin: "1rem 0",
          background: "var(--color-background-secondary)",
          borderRadius: 16,
          letterSpacing: "2.25cqw",
          whiteSpace: "nowrap",
          animation: celebrate ? "pulse 0.4s ease" : "none",
          border: celebrate ? `2px solid ${accentColor}60` : "2px solid transparent",
          transition: "border 0.3s",
          containerType: "inline-size",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {puzzle.emojis}
      </div>

      <input
        ref={inputRef}
        className={letterHint ? "puzzle-input puzzle-input--hint" : "puzzle-input"}
        value={input}
        onChange={onInputChange}
        placeholder={inputPlaceholder}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        style={{
          width: "100%",
          maxWidth: 400,
          margin: "16px auto 0",
          display: "block",
          fontSize: 16,
          padding: "14px 16px",
          borderRadius: 12,
          border: `2px solid ${celebrate ? accentColor : "var(--border)"}`,
          background: celebrate ? bgColor : "var(--code-bg)",
          color: "var(--text-h)",
          textAlign: "left",
          boxSizing: "border-box",
          transition: "border 0.2s, background 0.2s",
        }}
        disabled={celebrate}
        readOnly={answerRevealed}
      />

      {!answerRevealed && !celebrate && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            margin: "16px auto 0",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: 400,
            boxSizing: "border-box",
          }}
        >
          <button
            type="button"
            title={hintState >= 1 ? undefined : "Quita 1 estrella"}
            onClick={() => {
              onUseHint();
              inputRef.current?.focus({ preventScroll: true });
            }}
            disabled={hintState >= 1}
            style={{
              ...btnRow,
              border: `1.5px solid ${accentColor}`,
              background: bgColor,
              color: accentColor,
              opacity: hintState >= 1 ? 0.5 : 1,
              cursor: hintState >= 1 ? "not-allowed" : "pointer",
            }}
          >
            Pista
          </button>
          <button
            type="button"
            title="Muestra la respuesta y continúa en 3 s (0 estrellas)"
            onClick={() => {
              onRevealAnswer();
              inputRef.current?.focus({ preventScroll: true });
            }}
            style={{
              ...btnRow,
              border: "1.5px solid var(--border)",
              background: "color-mix(in srgb, var(--bg) 94%, var(--border) 6%)",
              color: "var(--text)",
            }}
          >
            Respuesta
          </button>
        </div>
      )}

      {answerRevealed && (
        <p
          style={{
            textAlign: "center",
            marginTop: 16,
            fontSize: 13,
            color: "var(--color-text-secondary)",
          }}
        >
          Siguiente reto en 3 s…
        </p>
      )}

      {celebrate && (
        <div className="answer-flash-overlay" aria-live="polite">
          <div className="answer-flash-scrim" aria-hidden />
          <div
            className="answer-flash-card"
            style={{
              color: accentColor,
              background: bgColor,
              borderColor: `${accentColor}40`,
            }}
          >
            {puzzle.display}
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        .answer-flash-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(1rem, 4vw);
          pointer-events: none;
        }
        .answer-flash-scrim {
          position: absolute;
          inset: 0;
          background: color-mix(in srgb, var(--bg) 82%, var(--text-h) 18%);
          opacity: 0;
          animation: answerFlashScrim 1s cubic-bezier(0.25, 0.85, 0.35, 1) forwards;
        }
        .answer-flash-card {
          position: relative;
          z-index: 1;
          margin: 0;
          max-width: min(92vw, 28rem);
          padding: 1.1rem 1.35rem;
          border-radius: 16px;
          border: 1px solid;
          font-size: clamp(1.15rem, 4.2vw, 1.65rem);
          font-weight: 600;
          line-height: 1.35;
          letter-spacing: -0.02em;
          text-align: center;
          box-shadow:
            0 4px 24px color-mix(in srgb, var(--text-h) 12%, transparent),
            0 1px 3px color-mix(in srgb, var(--text-h) 8%, transparent);
          opacity: 0;
          transform: scale(0.92);
          animation: answerFlashCard 1s cubic-bezier(0.22, 0.95, 0.28, 1) forwards;
        }
        @keyframes answerFlashScrim {
          0% { opacity: 0; }
          14% { opacity: 1; }
          52% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes answerFlashCard {
          0% {
            opacity: 0;
            transform: scale(0.9);
            filter: blur(4px);
          }
          18% {
            opacity: 1;
            transform: scale(1.04);
            filter: blur(0);
          }
          40% {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
          100% {
            opacity: 0;
            transform: scale(1.08);
            filter: blur(2px);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .answer-flash-scrim {
            animation-duration: 0.28s;
            animation-timing-function: ease-out;
          }
          .answer-flash-card {
            animation: answerFlashCardReduced 0.36s ease-out forwards;
          }
          @keyframes answerFlashCardReduced {
            0% { opacity: 0; transform: scale(0.98); filter: none; }
            35% { opacity: 1; transform: scale(1); filter: none; }
            100% { opacity: 0; transform: scale(1); filter: none; }
          }
        }
        .puzzle-input {
          outline: none;
        }
        .puzzle-input:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 2px;
        }
        .puzzle-input::placeholder {
          color: var(--text);
          opacity: 0.55;
        }
        .puzzle-input--hint::placeholder {
          color: var(--accent);
          opacity: 1;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
