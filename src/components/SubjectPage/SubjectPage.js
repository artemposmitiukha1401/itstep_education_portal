import { useParams } from "react-router-dom";
import TopicList from "../TopicList/TopicList";
import SUBJECTS from "../../data/subjects";
import "./SubjectPage.css";

export default function SubjectPage() {
  const { id } = useParams();
  const subject = SUBJECTS[id];

  if (!subject) return <p>Предмет не знайдено</p>;

  return (
    <section>
      <h1>{subject.name}</h1>
      <TopicList topics={subject.topics} />
    </section>
  );
}
