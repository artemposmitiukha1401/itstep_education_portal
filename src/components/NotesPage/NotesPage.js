import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./NotesPage.css";

const JSON_MAP = {
    math: () => import('../../data/math.json'),
    english: () => import('../../data/english.json'),
    ukrainian: () => import('../../data/ukrainian.json'),
    ukrainian_history: () => import('../../data/ukrainian_history.json'),
};

export default function NotesPage() {
    const { subjectId, topicId } = useParams();
    const [topic, setTopic] = useState(null);

    useEffect(() => {
        const loader = JSON_MAP[subjectId];
        if (!loader) return;

        loader().then((module) => {
            const found = module.default.topics.find(
                (t) => String(t.id) === topicId
            );
            setTopic(found);

        });
    }, [subjectId, topicId]);

    if (!topic) return <p>Завантаження...</p>;
    return (
        <div className="SubTopicList">
            {topic.subtopics.map((sub) => (
                <div key={sub.id} className="SubTopicItem" style={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px', padding: '20px 40px' }}>
                    <h2>{sub.title}</h2>
                    <Link to={`/subject/${subjectId}/topic/${topic.id}/note/${sub.id}`}>Перейти</Link>
                </div>
            ))}
        </div>
    );
}

// Вот тут когда нажимаем на кнопку перейти, то переводит на страницу где есть две картчоки, теория и тесты, кода нажимаем на теорию, то переносит на еще одну страницу, где отображен список подтем и кнопка перейти