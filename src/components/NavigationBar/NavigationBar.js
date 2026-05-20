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
  const closeTimer = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);

      if (closeTimer.current) {
        clearTimeout(closeTimer.current);
      }
    };
  }, []);

  function openDropdown() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
    }

    setOpen(true);
  }

  function closeDropdown() {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 120);
  }

  function toggleDropdown(event) {
    event.preventDefault();
    event.stopPropagation();
    setOpen((value) => !value);
  }

  function handleSelect() {
    setOpen(false);
    onSelect?.();
  }

  return (
    <div
      className="nav-dropdown"
      ref={ref}
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
    >
      <div className={`nav-dropdown-trigger ${open ? "nav-dropdown-trigger--open" : ""}`}>
        <Link
          to="/subjects-homepage"
          className="nav-dropdown-main-link"
          onClick={handleSelect}
        >
          Предмети
        </Link>

        <button
          type="button"
          className="nav-dropdown-chevron-button"
          onClick={toggleDropdown}
          aria-label={open ? "Закрити список предметів" : "Відкрити список предметів"}
          aria-expanded={open}
          aria-controls="subjects-dropdown-menu"
        >
          <span className="nav-dropdown-chevron" aria-hidden="true">
            {open ? "▲" : "▼"}
          </span>
        </button>
      </div>

      {open && (
        <div className="nav-dropdown-menu" id="subjects-dropdown-menu">
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

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <nav className="NavigationBar" ref={navRef} aria-label="Головна навігація">
      <button
        type="button"
        className={`NavigationBar-burger ${mobileOpen ? "NavigationBar-burger--open" : ""}`}
        onClick={() => setMobileOpen((value) => !value)}
        aria-label={mobileOpen ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={mobileOpen}
        aria-controls="main-navigation-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        className={`NavigationBar-menu ${mobileOpen ? "NavigationBar-menu--open" : ""}`}
        id="main-navigation-menu"
      >
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