import logo from "@assets/img/logo.png";
import "./Header.scss";

export function Header() {
  return (
    <div className="Header secondary">
      <img src={logo} className="Logo" />
      <h1 className="title">Git Glider</h1>
    </div>
  );
}
