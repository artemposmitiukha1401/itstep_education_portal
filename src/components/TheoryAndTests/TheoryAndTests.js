import './TopicPage.css';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const JSON_MAP = {
  math: () => import('../../data/math.json'),
  english: () => import('../../data/english.json'),
  ukrainian: () => import('../../data/ukrainian.json'),
  ukrainian_history: () => import('../../data/ukrainian_history.json'),
};

export default function TopicPage() {
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
    <div className="TopicPage">
      <Link to={`/subject/${subjectId}`}>Назад</Link>
      <h1>{topic.title}</h1>
      <div className="TopicContent" style={{ display: 'flex', gap: '20px' }}>
        <Link to={`/subject/${subjectId}/topic/${topicId}/note`} style={{display: 'Flex', padding: '20px 40px', border: '1px solid #FFF'}}>Теорія</Link>
        <Link to={`/subject/${subjectId}/topic/${topicId}/quiz`} style={{display: 'Flex', padding: '20px 40px', border: '1px solid #FFF'}}>Тести</Link>
      </div>
    </div>
  );
}