import englishData from "../../data/english_topics_data.json";
import historyData from "../../data/history_topics_data.json";
import mathData from "../../data/math_topics_data.json";
import ukrainianData from "../../data/ukrainian_topics_data.json";
import theoryData from "../../data/theory_topics.json";
import "./SubtopicNoteContentInline.css"

const subjectNotesFiles = {
    1: mathData,
    2: ukrainianData,
    3: historyData,
    4: englishData,
    theory: theoryData,
};

export default function SubtopicNoteContentInline({ subjectId, topicId, subtopicId, scale }) {
    const notesData = subjectNotesFiles[subjectId];
    const note = notesData?.find(
        (item) =>
            String(item.topics_id) === String(topicId) &&
            String(item.subtopic_id) === String(subtopicId)
    );

    if (!note) return <p>Конспект ще не додано.</p>;

    return (
        <div className="SubtopicNoteContentInline" style={{ '--content-scale': scale }}>
            {note.text && (
                <div dangerouslySetInnerHTML={{ __html: note.text }} />
            )}
            {note.images?.filter(Boolean).map((url, i) => (
                <img key={i} src={url} alt={`Зображення ${i + 1}`} />
            ))}
        </div>
    );
}