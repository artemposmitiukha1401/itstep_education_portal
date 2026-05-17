import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import subjectsData from "../../data/theory_topics.json";
import "./TopicList.css";
import SubtopicNoteContentInline from "../SubtopicNoteContentInline/SubtopicNoteContentInline";

export default function TopicList() {
  const { subjectId } = useParams();
  const [openTopicId, setOpenTopicId] = useState(null);
  const [activeSubtopic, setActiveSubtopic] = useState(null);
  const [fontSize, setFontSize] = useState(1);
  const [slideDir, setSlideDir] = useState(null);
  const [animKey, setAnimKey] = useState(0);

  const subject = subjectsData.find(
    (item) => String(item.id) === String(subjectId),
  );

  const allSubtopics =
    subject?.topics.flatMap((topic) =>
      (topic.subtopics || []).map((sub) => ({
        topicId: topic.id,
        subtopicId: sub.id,
      })),
    ) || [];

  const currentIndex = allSubtopics.findIndex(
    (s) =>
      s.topicId === activeSubtopic?.topicId &&
      s.subtopicId === activeSubtopic?.subtopicId,
  );

  const goTo = (index) => {
    if (index < 0 || index >= allSubtopics.length) return;
    const dir = index > currentIndex ? "down" : "up";
    setSlideDir(dir);
    setAnimKey((k) => k + 1);
    const next = allSubtopics[index];
    setActiveSubtopic(next);
    setOpenTopicId(next.topicId);
  };

  const openSubtopic = (topicId, subtopicId) => {
    const index = allSubtopics.findIndex(
      (s) => s.topicId === topicId && s.subtopicId === subtopicId,
    );
    if (activeSubtopic === null) {
      // first open — no animation
      setSlideDir(null);
      setAnimKey((k) => k + 1);
      setActiveSubtopic({ topicId, subtopicId });
      setOpenTopicId(topicId);
    } else {
      goTo(index);
    }
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
          <svg
            className="btn-arrow"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="#103058"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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

              <div
                className={`TopicList-subtopics ${openTopicId === topic.id ? "open" : ""}`}
              >
                {topic.subtopics?.map((subtopic, subIndex) => (
                  <button
                    key={subtopic.id}
                    className={`TopicList-subtopicLink ${
                      activeSubtopic?.subtopicId === subtopic.id ? "active" : ""
                    }`}
                    onClick={() => openSubtopic(topic.id, subtopic.id)}
                  >
                    <span className="TopicList-topicNumber">
                      {topic.id}.{subIndex + 1}.{" "}
                    </span>
                    {subtopic.title}
                  </button>
                ))}
                <Link
                  className="topicTestBtn"
                  to={`/subject/${subjectId}/topic/${topic.id}/quiz`}
                >
                  <span className="topicTestBtnText">Пройти тест</span>
                  <svg
                    className="topicTestBtnIcon"
                    width="100%"
                    height="100%"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 3.99998H6.8C5.11984 3.99998 4.27976 3.99998 3.63803 4.32696C3.07354 4.61458 2.6146 5.07353 2.32698 5.63801C2 6.27975 2 7.11983 2 8.79998V17.2C2 18.8801 2 19.7202 2.32698 20.362C2.6146 20.9264 3.07354 21.3854 3.63803 21.673C4.27976 22 5.11984 22 6.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9264 19.673 20.362C20 19.7202 20 18.8801 20 17.2V13M7.99997 16H9.67452C10.1637 16 10.4083 16 10.6385 15.9447C10.8425 15.8957 11.0376 15.8149 11.2166 15.7053C11.4184 15.5816 11.5914 15.4086 11.9373 15.0627L21.5 5.49998C22.3284 4.67156 22.3284 3.32841 21.5 2.49998C20.6716 1.67156 19.3284 1.67155 18.5 2.49998L8.93723 12.0627C8.59133 12.4086 8.41838 12.5816 8.29469 12.7834C8.18504 12.9624 8.10423 13.1574 8.05523 13.3615C7.99997 13.5917 7.99997 13.8363 7.99997 14.3255V16Z"
                      stroke="#103058"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeSubtopic && (
        <div className="TopicList-content">
          <div className="TopicList-contentNav">
            <button
              className="nav-btn"
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex <= 0}
              aria-label="Попередня підтема"
            >
              <span className="btn-text">Назад</span>
              <svg
                className="btn-arrow"
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M19 12H5M5 12L12 19M5 12L12 5"
                  stroke="#103058"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="nav-btn font-size-nav-btn"
              onClick={cycleFontSize}
              aria-label="Збільшити текст"
            >
              <span className="btn-text">{fontSizeLabel[fontSize]}</span>
              <svg
                className="btn-arrow font-size-icon"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5V19M5 12H19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="nav-btn"
              onClick={() => setActiveSubtopic(null)}
              aria-label="Закрити"
            >
              <span className="btn-text">Закрити</span>
              <svg
                className="btn-arrow"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="#103058"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="nav-btn nav-btn--right"
              onClick={() => goTo(currentIndex + 1)}
              disabled={currentIndex >= allSubtopics.length - 1}
              aria-label="Наступна підтема"
            >
              <span className="btn-text">Далі</span>
              <svg
                className="btn-arrow"
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="#103058"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div
            key={animKey}
            className={`subtopicSlide ${slideDir ? `slideIn--${slideDir}` : ""}`}
          >
            <SubtopicNoteContentInline
              subjectId={subjectId}
              topicId={activeSubtopic.topicId}
              subtopicId={activeSubtopic.subtopicId}
              scale={fontSizeMap[fontSize]}
            />
          </div>
        </div>
      )}
    </div>
  );
}