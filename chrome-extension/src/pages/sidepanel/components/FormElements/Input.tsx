import "./FormElements.scss";

export function Input({
  value,
  onChange,
  label,
  type = "text",
  width = "100%",
}) {
  return (
    <label className="InputLabel" style={{ width }}>
      {label}:
      <input
        className="Input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
