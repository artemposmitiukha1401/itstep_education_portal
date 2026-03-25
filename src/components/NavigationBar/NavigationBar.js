import { Link } from "react-router-dom";
import "./NavigationBar.css";

const NAV_ITEMS = [
  {
    name: "Головна",
    link: "/home",
  },
  {
    name: "Про нас",
    link: "/about",
  },
];

function NavigationBar() {
  return (
    <nav className="NavigationBar">
      {NAV_ITEMS.map((item) => (
        <Link key={item.link} to={item.link}>
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

export default NavigationBar;
