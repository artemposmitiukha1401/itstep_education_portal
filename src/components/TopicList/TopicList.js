import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import subjectsData from "../../data/theory_topics.json";
import "./TopicList.css";
import SubtopicNoteContentInline from "../SubtopicNoteContentInline/SubtopicNoteContentInline";

export default function TopicList() {
    const { subjectId } = useParams();
    const [openTopicId, setOpenTopicId] = useState(null);
    const [activeSubtopic, setActiveSubtopic] = useState(null);
    const [fontSize, setFontSize] = useState(1); // 1 = normal, 2 = large, 3 = xlarge

    const subject = subjectsData.find(
        (item) => String(item.id) === String(subjectId)
    );


    const allSubtopics = subject?.topics.flatMap((topic) =>
        (topic.subtopics || []).map((sub) => ({
            topicId: topic.id,
            subtopicId: sub.id,
        }))
    ) || [];

    const currentIndex = allSubtopics.findIndex(
        (s) =>
            s.topicId === activeSubtopic?.topicId &&
            s.subtopicId === activeSubtopic?.subtopicId
    );

    const goTo = (index) => {
        if (index < 0 || index >= allSubtopics.length) return;
        const next = allSubtopics[index];
        setActiveSubtopic(next);
        // Открываем тему в сайдбаре
        setOpenTopicId(next.topicId);
    };

    const cycleFontSize = () => {
        setFontSize((prev) => (prev === 3 ? 1 : prev + 1));
    };

    const fontSizeMap = { 1: "1", 2: "1.2", 3: "1.45" };
    const fontSizeLabel = { 1: "A", 2: "A+", 3: "A++" };

    if (!subject) return <p>Предмет не знайдено.</p>;

    return (
        <div className={`TopicList-layout ${activeSubtopic ? "split" : ""}`}>

            {/* Левая панель */}
            <div className="TopicList-sidebar">
                <Link to="/home" className="back-btn">
                    <span className="btn-text">Предмети</span>
                    <svg className="btn-arrow" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#103058" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>

                <h1 className="TopicList-title">{subject.subject_name}</h1>

                <div className="topics">
                    {subject.topics.map((topic, index) => (
                        <div key={topic.id} className="TopicList-topic">
                            <button
                                className="TopicList-topicButton"
                                onClick={() =>
                                    setOpenTopicId(openTopicId === topic.id ? null : topic.id)
                                }
                            >
                                <span className="TopicList-topicNumber">{index + 1}.</span>
                                <span style={{ flex: 1 }}>{topic.title}</span>
                                <img
                                    src="/open_question.svg"
                                    alt=""
                                    className={`TopicList-arrowIcon ${openTopicId === topic.id ? "open" : ""}`}
                                />
                            </button>

                            <div className={`TopicList-subtopics ${openTopicId === topic.id ? "open" : ""}`}>
                                {topic.subtopics?.map((subtopic, subIndex) => (
                                    <button
                                        key={subtopic.id}
                                        className={`TopicList-subtopicLink ${
                                            activeSubtopic?.subtopicId === subtopic.id ? "active" : ""
                                        }`}
                                        onClick={() => {
                                            setActiveSubtopic({ topicId: topic.id, subtopicId: subtopic.id });
                                        }}
                                    >
                                        <span className="TopicList-topicNumber">
                                            {topic.id}.{subIndex + 1}.{" "}
                                        </span>
                                        {subtopic.title}
                                    </button>
                                ))}
                                <Link to={`/subject/${subjectId}/topic/${topic.id}/quiz`}>Пройти тест за темою</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Правая панель */}
            {activeSubtopic && (
                <div className="TopicList-content">

                    <div className="TopicList-contentNav">
                        {/* Предыдущая */}
                        <button
                            className="nav-btn"
                            onClick={() => goTo(currentIndex - 1)}
                            disabled={currentIndex <= 0}
                            aria-label="Попередня підтема"
                        >
                            <span className="btn-text">Назад</span>
                            <svg className="btn-arrow" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#103058" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        <button
                            className="nav-btn font-size-nav-btn"
                            onClick={cycleFontSize}
                            aria-label="Збільшити текст"
                        >
                            <span className="btn-text">{fontSizeLabel[fontSize]}</span>


                            <svg className="btn-arrow font-size-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>

                        {/* Закрыть */}
                        <button
                            className="nav-btn"
                            onClick={() => setActiveSubtopic(null)}
                            aria-label="Закрити"
                        >
                            <span className="btn-text">Закрити</span>
                            <svg className="btn-arrow" width="26" height="26" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="#103058" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {/* Следующая */}
                        <button
                            className="nav-btn nav-btn--right"
                            onClick={() => goTo(currentIndex + 1)}
                            disabled={currentIndex >= allSubtopics.length - 1}
                            aria-label="Наступна підтема"
                        >
                            <span className="btn-text">Далі</span>
                            <svg className="btn-arrow" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#103058" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>


                        <SubtopicNoteContentInline
                            subjectId={subjectId}
                            topicId={activeSubtopic.topicId}
                            subtopicId={activeSubtopic.subtopicId}
                            scale={fontSizeMap[fontSize]}
                        />
                </div>
            )}
        </div>
    );
}