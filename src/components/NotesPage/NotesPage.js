import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./NotesPage.css";

const JSON_MAP = {
    math: () => import("../../data/math.json"),
    english: () => import("../../data/english.json"),
    ukrainian: () => import("../../data/ukrainian.json"),
    ukrainian_history: () => import("../../data/ukrainian_history.json"),
};

export default function NotesPage() {
    const { subjectId, topicId } = useParams();
    const [topic, setTopic] = useState(null);

    useEffect(() => {
        const loader = JSON_MAP[subjectId];
        if (!loader) return;

        loader()
            .then((module) => {
                const foundTopic = module.default.topics.find(
                    (t) => String(t.id) === String(topicId)
                );
                setTopic(foundTopic || null);
            })
            .catch((err) => {
                console.error("Failed to load topic:", err);
                setTopic(null);
            });
    }, [subjectId, topicId]);

    if (!topic) return <p>Завантаження...</p>;

    return (
        <div className="NotesPage">
            <Link to={`/subject/${subjectId}`}>Назад</Link>
            <h1>{topic.title}</h1>

            <div className="SubTopicList">
                {topic.subtopics?.map((subtopic) => (
                    <div key={subtopic.id} className="SubTopicItem">
                        <Link to={`/subject/${subjectId}/topic/${topicId}/notes/${subtopic.id}`}>
                            {subtopic.title}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}