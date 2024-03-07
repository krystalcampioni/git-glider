import { ProjectBoardHandler } from "./components/ProjectBoardHandler";
import { TaskListHandler } from "./components/TaskListHandler";
import { NotificationsHandler } from "./components/NotificationsHandler";

export default function App() {
  if (!window.location.hostname.includes("github")) return null;

  return (
    <>
      <ProjectBoardHandler />
      <TaskListHandler />
      <NotificationsHandler />
    </>
  );
}
