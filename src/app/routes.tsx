import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Workspace } from "./pages/Workspace";
import { StudyRoom } from "./pages/StudyRoom";
import { Progress } from "./pages/Progress";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/workspace",
    Component: Workspace,
  },
  {
    path: "/study-room",
    Component: StudyRoom,
  },
  {
    path: "/progress",
    Component: Progress,
  },
]);
