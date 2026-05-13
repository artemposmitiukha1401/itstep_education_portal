import NavigationBar from "../NavigationBar/NavigationBar";
import "./Header.css";
import { Link } from "react-router-dom";
import HeaderLogin from "../HeaderLogin/HeaderLogin";


function Header() {
  return (
    <header className="Header">
      <Link className="to-home" to="/home">
          <img src="/logo.svg" alt="logo" />
      </Link>
      <NavigationBar></NavigationBar>
        <HeaderLogin></HeaderLogin>
    </header>
  );
}
export default Header;
