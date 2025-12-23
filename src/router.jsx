
import { createBrowserRouter } from "react-router-dom";
import QuestionPage from "./pages/QuestionPage";

export const router = createBrowserRouter([
  {
    path: "/q/:slug",
    element: <QuestionPage />,
  },
  {
    path: "*",
    element: <div style={{ padding: 20 }}>Open /q/two-sum</div>,
  },
]);
