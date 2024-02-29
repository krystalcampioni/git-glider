export function MagicButton({ onClick, children }) {
  return (
    <button
      className="MagicButton"
      onClick={() => {
        console.log("clicked");
        onClick();
      }}
    >
      ✨ {children}
    </button>
  );
}
