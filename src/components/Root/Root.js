import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SubjectMap from "../SubjectNetwork/SubjectMap";
import TheoryAndTests from "../TheoryAndTests/TheoryAndTests";
import SubjectsTopics from "../SubjectsTopics/SubjectsTopics";
import "./Root.css";
import Header from "../Header/Header";
import NotesPage from "../NotesPage/NotesPage";
import SubtopicNotePage from "../SubtopicNotePage/SubtopicNotePage";
import TestsListPage from "../TestsListPage/TestsListPage";

export default function Root() {
  return (
    <div className="Root">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<SubjectMap />} />
        <Route path="/about" element={<div>About Page</div>} />
        <Route path="/subject/:id" element={<SubjectsTopics />} />
        <Route path="/subject/:subjectId" element={<SubjectsTopics />} />
        <Route
          path="/subject/:subjectId/topic/:topicId"
          element={<TheoryAndTests />}
        />
        <Route
          path="/subject/:subjectId/topic/:topicId/notes"
          element={<NotesPage />}
        />
          <Route
              path="/subject/:subjectId/topic/:topicId/quiz"
              element={<TestsListPage />}
          />
          <Route
              path="/subject/:subjectId/topic/:topicId/notes/:subtopicId"
              element={<SubtopicNotePage />}
          />

      </Routes>
      <Outlet />
    </div>
  );
}