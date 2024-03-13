export function Chevron({ angle = 0 }) {
  return (
    <svg
      style={{
        transform: `rotate(${angle}deg)`,
        transition: "transform 0.3s ease",
        fill: `var(--color-text-secondary)`,
      }}
      width="16"
      height="16"
      aria-hidden="true"
      className="octicon octicon-chevron-right Details-content--shown"
      data-view-component="true"
      viewBox="0 0 16 16"
    >
      <path d="M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.751.751 0 01-1.042-.018.751.751 0 01-.018-1.042L9.94 8 6.22 4.28a.75.75 0 010-1.06z"></path>
    </svg>
  );
}
