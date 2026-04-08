import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SubjectMap from "../SubjectNetwork/SubjectMap";
import TopicPage from "../TopicPage/TopicPage";
import SubjectPage from "../SubjectPage/SubjectPage";
import "./Root.css";
import Header from "../Header/Header";
import NotesPage from "../NotesPage/NotesPage";

function Root() {
  return (
    <div className="Root">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<SubjectMap />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/subject/:id" element={<SubjectPage />} />
          <Route path="/subject/:subjectId" element={<SubjectPage />} />
  <Route path="/subject/:subjectId/topic/:topicId" element={<TopicPage/>} /> 
  <Route path="/subject/:subjectId/topic/:topicId/notes" element={<NotesPage/>} />

      </Routes>
      <Outlet />
    </div>
  );
}

export default Root;
