import { useState, useRef, useEffect } from "react";
import "./TokenInstructions.scss";
import {} from "react";

export function TokenInstructions() {
  const ref = useRef<HTMLDivElement>(null);

  const [show, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  useEffect(() => {
    if (!ref.current) return;

    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return (
    <div className="TokenInstructions">
      <button onClick={toggleShow} className="InputNote">
        Don't have a token yet?
      </button>

      <div
        ref={ref}
        className={`SlideIn ${show && "isOpen"}`}
        aria-hidden={!show}
      >
        <ol>
          <li>
            Log into{" "}
            <a href="https://github.com/" target="_blank">
              GitHub
            </a>{" "}
            .
          </li>
          <li>
            Go to{" "}
            <a href="https://github.com/settings/tokens">{`Developers Settings > Personal access tokens`}</a>
          </li>
          <li>
            Click <em>Generate new token</em>
          </li>
          <li>Name your token and select 'repo' under scopes.</li>
          <li>
            Click <em>Generate token</em> and copy it immediately, as you won't
            see it again
          </li>
        </ol>
      </div>
    </div>
  );
}
