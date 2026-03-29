import TopicItem from "../TopicItem/TopicItem";
import "./TopicList.css";

export default function TopicList({ topics, subjectId }) {
  return (
    <div className="TopicList">
      {topics.map((item) => (
        <TopicItem
          key={item.id}
          index={item.id}
          title={item.title}
          link={`/subject/${subjectId}/topic/${item.id}`}
        />
      ))}
    </div>
  );
}
