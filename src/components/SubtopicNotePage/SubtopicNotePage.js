import {useParams, Link} from "react-router-dom";
import {useState} from "react";

import englishData from "../../data/english_topics_data.json";
import historyData from "../../data/history_topics_data.json";
import mathData from "../../data/math_topics_data.json";
import ukrainianData from "../../data/ukrainian_topics_data.json";
import theoryData from "../../data/theory_topics.json";



const subjectNotesFiles = {
    1: mathData,
    2: ukrainianData,
    3: historyData,
    4: englishData,
    theory: theoryData,
};

export default function SubtopicNotePage() {
    const {subjectId, topicId, subtopicId} = useParams();
    const [fontSize, setFontSize] = useState(1);

    const fontSizeMap = {
        1: 1,
        2: 1.15,
        3: 1.3,
    };

    const fontSizeLabel = {
        1: "A",
        2: "A+",
        3: "A++",
    };

    const cycleFontSize = () => {
        setFontSize((prev) => (prev === 3 ? 1 : prev + 1));
    };

    const notesData = subjectNotesFiles[subjectId];

    if (!notesData) {
        return <p>Файл для цього предмета не знайдено.</p>;
    }

    const note = notesData.find(
        (item) =>
            String(item.topics_id) === String(topicId) &&
            String(item.subtopic_id) === String(subtopicId)
    );

    if (!note) {
        return <p>Конспект для цієї підтеми ще не додано.</p>;
    }

    return (
        <div
            className="SubtopicNotePage"
            style={{fontSize: `calc(1rem * ${fontSizeMap[fontSize]})`}}
        >
            <div className="SubtopicNotePage-actions">
                <Link
                    to={`/subject/${subjectId}`}
                    className="back-btn"
                    aria-label="Назад до предметів"
                >
                    <span className="btn-text">Предмети</span>

                    <svg
                        className="btn-arrow"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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

                <button
                    type="button"
                    className="font-size-btn"
                    onClick={cycleFontSize}
                    aria-label="Змінити розмір тексту"
                >
                    <span>{fontSizeLabel[fontSize]}</span>

                    <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="#103058FF" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

            {note.text ? (
                <div
                    className="SubtopicNotePage-text"
                    dangerouslySetInnerHTML={{__html: note.text}}
                />
            ) : (
                <p>Текст конспекту ще не додано.</p>
            )}

            {note.images?.filter(Boolean).length > 0 && (
                <div className="SubtopicNotePage-images">
                    {note.images.filter(Boolean).map((imageUrl, index) => (
                        <img
                            key={index}
                            src={imageUrl}
                            alt={`Зображення ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}