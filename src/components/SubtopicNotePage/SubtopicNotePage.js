import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./SubtopicNotePage.css";

const JSON_MAP = {
    math: () => import("../../data/math.json"),
    english: () => import("../../data/english.json"),
    ukrainian: () => import("../../data/ukrainian.json"),
    ukrainian_history: () => import("../../data/ukrainian_history.json"),
};

export default function SubtopicNotePage() {
    const { subjectId, topicId, subtopicId } = useParams();
    const [subtopic, setSubtopic] = useState(null);

    useEffect(() => {
        const loader = JSON_MAP[subjectId];
        if (!loader) return;

        loader()
            .then((module) => {
                const foundTopic = module.default.topics.find(
                    (t) => String(t.id) === String(topicId)
                );

                const foundSubtopic = foundTopic?.subtopics?.find(
                    (s) => String(s.id) === String(subtopicId)
                );

                setSubtopic(foundSubtopic || null);
            })
            .catch((err) => {
                console.error("Failed to load subtopic:", err);
                setSubtopic(null);
            });
    }, [subjectId, topicId, subtopicId]);

    if (!subtopic) return <p>Завантаження...</p>;

    return (
        <div className="SubtopicNotePage">
            <Link to={`/subject/${subjectId}/topic/${topicId}/notes`}>Назад</Link>

            <h2>{subtopic.title}</h2>
            <p>{subtopic.text}</p>

            <div className="SubtopicImages">
                {subtopic.images?.map((image, index) => (
                    <div key={index} className="SubtopicImageItem">
                        <img src={image.url} alt={image.caption || subtopic.title} />
                        <p>{image.caption}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}