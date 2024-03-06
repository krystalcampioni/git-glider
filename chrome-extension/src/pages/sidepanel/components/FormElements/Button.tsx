export function Button({
  children,
  onClick = () => {},
  variant = "Success",
  type = "button",
}) {
  return (
    <button className={`Button ${variant}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
