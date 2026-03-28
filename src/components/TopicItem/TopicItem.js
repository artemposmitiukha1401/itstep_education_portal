import "./TopicItem.css";
import { Link } from "react-router-dom";

export default function TopicItem({ index, title, link }) {
  return (
    <Link to={link} className="TopicItem">
      <h2>{index + ". " + title}</h2>
      <span>Перейти</span>
    </Link>
  );
}
