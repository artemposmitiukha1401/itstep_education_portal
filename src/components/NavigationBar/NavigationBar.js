import { useState, useRef, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "./NavigationBar.css";

const SUBJECTS = [
  { name: "Математика", id: "1" },
  { name: "Англійська мова", id: "4" },
  { name: "Українська мова", id: "2" },
  { name: "Історія України", id: "3" },
];

const NAV_ITEMS = [
  { name: "Головна", link: "/home" },
  { name: "Про нас", link: "/about" },
  { name: "Результати", link: "/history" },
];

function SubjectsDropdown({ onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect() {
    setOpen(false);
    onSelect?.();
  }

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        type="button"
        className={`nav-dropdown-trigger ${open ? "nav-dropdown-trigger--open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        Предмети
        <span className="nav-dropdown-chevron">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="nav-dropdown-menu">
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              to={`/subject/${subject.id}`}
              className="nav-dropdown-item"
              onClick={handleSelect}
            >
              {subject.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavigationBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <nav className="NavigationBar" ref={navRef}>
      <button
        type="button"
        className={`NavigationBar-burger ${mobileOpen ? "NavigationBar-burger--open" : ""}`}
        onClick={() => setMobileOpen((value) => !value)}
        aria-label={mobileOpen ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={mobileOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`NavigationBar-menu ${mobileOpen ? "NavigationBar-menu--open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.link}
            to={item.link}
            onClick={closeMobileMenu}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.name}
          </NavLink>
        ))}

        <SubjectsDropdown onSelect={closeMobileMenu} />
      </div>
    </nav>
  );
}