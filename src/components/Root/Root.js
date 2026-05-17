import { useEffect, useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import SubjectMap from "../SubjectNetwork/SubjectMap";
import MobileHomepage from "../MobileHomepage/MobileHomepage";
import "./Root.css";
import Header from "../Header/Header";
import QuizPage from "../QuizPage/QuizPage";
import QuizHistory from "../ResultsHistory/ResultsHistory";
import TopicList from "../TopicList/TopicList";
import Footer from "../Footer/Footer";
import AboutPage from "../AboutPage/AboutPage";
import LoginModalWindow from "../LoginModalWindow/LoginModalWindow";
import RegisterModalWindow from "../RegisterModalWindow/RegisterModalWindow";
import { AuthModalProvider } from "../AuthModalContext/AuthModalContext";

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    function handleChange(event) {
      setMatches(event.matches);
    }

    setMatches(media.matches);
    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}

function HomePage() {
  const isPhone = useMediaQuery("(max-width: 768px)");

  return isPhone ? <MobileHomepage /> : <SubjectMap />;
}

function RootInner() {
  const [authModal, setAuthModal] = useState(null);

  function closeAuthModal() {
    setAuthModal(null);
  }

  return (
    <AuthModalProvider
      openLogin={() => setAuthModal("login")}
      openRegister={() => setAuthModal("register")}
    >
      <div className="Root">
        <Header />

        <Routes>
          <Route path="/history" element={<QuizHistory />} />
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/subject/:subjectId" element={<TopicList />} />
          <Route path="/subject/:subjectId/topic/:topicId/quiz" element={<QuizPage />} />
        </Routes>

        <Outlet />
        <Footer />

        {authModal === "login" && (
          <LoginModalWindow
            onClose={closeAuthModal}
            onRegisterClick={() => setAuthModal("register")}
          />
        )}

        {authModal === "register" && (
          <RegisterModalWindow
            onClose={closeAuthModal}
            onLoginClick={() => setAuthModal("login")}
          />
        )}
      </div>
    </AuthModalProvider>
  );
}

export default function Root() {
  return <RootInner />;
}