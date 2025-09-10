import { Navigate, useLocation } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const loc = useLocation();

  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  }

  return children;
}