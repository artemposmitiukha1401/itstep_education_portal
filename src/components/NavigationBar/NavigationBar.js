import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavigationBar.css";

const SUBJECTS = [
  { name: "Математика",          id: "1" },
  { name: "Англійська мова",     id: "4" },
  { name: "Українська мова",     id: "2" },
  { name: "Історія України",     id: "3" },
];

const NAV_ITEMS = [
  { name: "Головна",    link: "/home" },
  { name: "Про нас",    link: "/about" },
  { name: "Результати", link: "/history" },
];

function SubjectsDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <div className="nav-dropdown" ref={ref}>
        <button
            className={`nav-dropdown-trigger ${open ? "nav-dropdown-trigger--open" : ""}`}
            onClick={() => setOpen((v) => !v)}
        >
          Предмети
          <span className="nav-dropdown-chevron">{open ? "▲" : "▼"}</span>
        </button>

        {open && (
            <div className="nav-dropdown-menu">
              {SUBJECTS.map((s) => (
                  <Link
                      key={s.id}
                      to={`/subject/${s.id}`}
                      className="nav-dropdown-item"
                      onClick={() => setOpen(false)}
                  >
                    {s.name}
                  </Link>
              ))}
            </div>
        )}
      </div>
  );
}

export default function NavigationBar() {
  return (
      <nav className="NavigationBar">

        {NAV_ITEMS.map((item) => (
            <Link key={item.link} to={item.link}>
              {item.name}
            </Link>
        ))}
          <SubjectsDropdown />

      </nav>
  );
}

