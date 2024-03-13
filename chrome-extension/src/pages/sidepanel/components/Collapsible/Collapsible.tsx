import { useState } from "react";
import { Chevron } from "../Icons/Chevron";
import "./Collapsible.scss";

export function Collapsible({ children, title }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="Collapsible GitGlider-Card">
      <button className="Collapsible__Header" onClick={handleCollapse}>
        {isCollapsed ? <Chevron angle={0} /> : <Chevron angle={90} />}

        <h3>{title}</h3>
      </button>
      {!isCollapsed && <div className="Collapsible__Content">{children}</div>}
    </div>
  );
}
