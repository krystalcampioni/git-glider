import "./FormElements.scss";

export function Select({ value, onChange, label, options, width = "100%" }) {
  return (
    <label className="InputLabel">
      {label}:
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="Input"
        style={{ width }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
