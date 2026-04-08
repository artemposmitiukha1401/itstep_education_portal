import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const JSON_MAP = {
  math: () => import('../../data/math.json'),
  english: () => import('../../data/english.json'),
  ukrainian: () => import('../../data/ukrainian.json'),
  ukrainian_history: () => import('../../data/ukrainian_history.json'),
};

export default function SubTopicsListPage() {
  const { subjectId, topicId } = useParams();
  const [subtopics, setSubtopics] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");

  useEffect(() => {
    const loader = JSON_MAP[subjectId];
    if (!loader) return;

    loader().then((module) => {
      const foundTopic = module.default.topics.find(
        (t) => String(t.id) === topicId
      );
      if (foundTopic) {
        setSubtopics(foundTopic.subtopics);
        setTopicTitle(foundTopic.title);
      }
    });
  }, [subjectId, topicId]);

  if (subtopics.length === 0) return <p>Завантаження підтем...</p>;

  return (
    <div className="SubTopicListPage" style={{ padding: '20px' }}>
      <Link to={`/subject/${subjectId}/topic/${topicId}`}>← Назад до вибору</Link>

      <h1 style={{ margin: '20px 0' }}>{topicTitle}: Підтеми</h1>

      <div className="SubTopicList" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {subtopics.map((sub) => (
          <div
            key={sub.id}
            className="SubTopicItem"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '15px 25px',
              border: '1px solid #ddd',
              borderRadius: '10px'
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '500' }}>{sub.title}</span>
            <Link
              to={`/subject/${subjectId}/topic/${topicId}/note/${sub.id}`}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '5px'
              }}
            >
              Читати конспект
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}