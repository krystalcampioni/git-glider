import { ProjectBoardHandler } from "./components/ProjectBoardHandler";

export default function App() {
  if (!window.location.hostname.includes("github")) return null;

  return (
    <>
      <ProjectBoardHandler />
    </>
  );
}
