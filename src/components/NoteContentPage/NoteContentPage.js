import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

const JSON_MAP = {
  math: () => import('../../data/math.json'),
  english: () => import('../../data/english.json'),
  ukrainian: () => import('../../data/ukrainian.json'),
  ukrainian_history: () => import('../../data/ukrainian_history.json'),
};

export default function NoteContentPage() {
  const { subjectId, topicId, subtopicId } = useParams();
  const [content, setContent] = useState(null);

  useEffect(() => {
    const loader = JSON_MAP[subjectId];
    if (!loader) return;

    loader().then((module) => {
      const topic = module.default.topics.find(t => String(t.id) === topicId);
      if (topic) {
        const subtopic = topic.subtopics.find(s => String(s.id) === subtopicId);
        setContent(subtopic);
      }
    });
  }, [subjectId, topicId, subtopicId]);

  if (!content) return <p>Завантаження конспекту...</p>;

  return (
    <div className="NoteContentPage" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <Link to={`/subject/${subjectId}/topic/${topicId}/note`}>← Назад до списку підтем</Link>

      <h1 style={{ marginTop: '20px' }}>{content.title}</h1>

      <div className="NoteText" style={{
        whiteSpace: 'pre-wrap',
        fontSize: '18px',
        lineHeight: '1.6',
        marginTop: '20px',
        textAlign: 'left'
      }}>
        {content.text}
      </div>

      {content.images && content.images.length > 0 && (
        <div className="NoteImages" style={{ marginTop: '30px' }}>
          {content.images.map((img) => (
            <div key={img.id} style={{ marginBottom: '20px' }}>
              {img.url && <img src={img.url} alt={img.caption} style={{ width: '100%', borderRadius: '8px' }} />}
              {img.caption && <p style={{ fontStyle: 'italic', color: '#666' }}>{img.caption}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}