import TopicItem from "../TopicItem/TopicItem";
import "./TopicList.css";

export default function TopicList({ topics }) {
  return (
    <div className="TopicList">
      {topics.map((item) => (
        <TopicItem
          key={item.chapter_id}
          index={item.chapter_id}
          title={item.name}
          link={item.link}
        />
      ))}
    </div>
  );
}
