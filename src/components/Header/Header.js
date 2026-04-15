import NavigationBar from "../NavigationBar/NavigationBar";
import "./Header.css";
import { Link } from "react-router-dom";
function Header() {
  return (
    <header className="Header">
      <Link className="to-home" to="/home">Освітня платформа</Link>
      <NavigationBar></NavigationBar>
    </header>
  );
}
export default Header;
