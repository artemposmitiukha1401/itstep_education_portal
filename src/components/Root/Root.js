import {Routes, Route, Navigate, Outlet} from "react-router-dom";
import SubjectMap from "../SubjectNetwork/SubjectMap";


import "./Root.css";
import Header from "../Header/Header";


import QuizPage from "../QuizPage/QuizPage";
import QuizHistory from "../ResultsHistory/ResultsHistory";


import TopicList from "../TopicList/TopicList";
import Footer from "../Footer/Footer";
import AboutPage from "../AboutPage/AboutPage";

export default function Root() {
    return (
        <div className="Root">
            <Header/>
            <Routes>
                <Route path="/history" element={<QuizHistory/>}/>
                <Route path="/" element={<Navigate to="/home" replace/>}/>
                <Route path="/home" element={<SubjectMap/>}/>
                <Route path="/about" element={<AboutPage/>}/>

                <Route path="/subject/:subjectId" element={<TopicList/>}/>


                {/*<Route*/}
                {/*    path="/subject/:subjectId/topic/:topicId/note/:subtopicId"*/}
                {/*    element={<SubtopicNotePage />}*/}
                {/*/>*/}

                <Route path="/subject/:subjectId/topic/:topicId/quiz" element={<QuizPage/>}/>

            </Routes>
            <Outlet/>
            <Footer></Footer>
        </div>
    );
}