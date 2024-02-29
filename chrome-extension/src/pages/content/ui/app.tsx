import { ProjectBoardHandler } from "./components/ProjectBoardHandler";
import { TaskListHandler } from "./components/TaskListHandler";

export default function App() {
  if (!window.location.hostname.includes("github")) return null;

  return (
    <>
      <ProjectBoardHandler />
      <TaskListHandler />
    </>
  );
}
