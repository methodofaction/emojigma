export function StarDisplay({ count, max = 3 }) {
  return (
    <span style={{ fontSize: 18, letterSpacing: 2 }}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ opacity: i < count ? 1 : 0.2 }}>
          {"\u2b50"}
        </span>
      ))}
    </span>
  );
}
