export function MagicButton({ onClick }) {
  return (
    <button
      className="MagicButton"
      onClick={() => {
        console.log("clicked");
        onClick();
      }}
    >
      ✨ Move all to current cycle
    </button>
  );
}
