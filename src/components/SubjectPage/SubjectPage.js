import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import TopicList from "../TopicList/TopicList";
import "./SubjectPage.css";
import { Link } from "react-router-dom";

const SUBJECTS = {
  math: { name: "Математика" },
  ukrainian: { name: "Українська мова" },
  ukrainian_history: { name: "Історія" },
  english: { name: "Англійська мова" },
};

const JSON_MAP = {
  math: () => import("../../data/math.json"),
  english: () => import("../../data/english.json"),
  ukrainian: () => import("../../data/ukrainian.json"),
  ukrainian_history: () => import("../../data/ukrainian_history.json"),
};

export default function SubjectPage() {
  const { id } = useParams();
  const subject = SUBJECTS[id];
  const [topics, setTopics] = useState(null);

  useEffect(() => {
    const loader = JSON_MAP[id];
    if (!loader) return;

    let cancelled = false;
    loader()
      .then((module) => {
        if (!cancelled) setTopics(module.default.topics);
      })
      .catch((err) => {
        console.error("Failed to load JSON:", err);
        if (!cancelled) setTopics([]);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!subject) return <p>Предмет не знайдено</p>;
  if (topics === null) return <p>Завантаження...</p>;

  return (
    <section>
      <Link to="/home">
        <p>До предметів</p>
      </Link>
      <h1>{subject.name}</h1>
      <TopicList topics={topics} subjectId={id} />
    </section>
  );
}
