import { Link } from "react-router-dom";
import subjectsData from "../../data/theory_topics.json";
import "./MobileHomepage.css";

const SUBJECT_ORDER = [1, 3, 2, 4];

const SUBJECT_ICONS = {
  1: "math",
  2: "ukrainian",
  3: "history",
  4: "english",
};

function formatTopicsCount(count) {
  if (count === 1) return "1 тема";

  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) {
    return `${count} теми`;
  }

  return `${count} тем`;
}

function getSubjects() {
  return SUBJECT_ORDER
    .map((id) => subjectsData.find((subject) => Number(subject.id) === id))
    .filter(Boolean)
    .map((subject) => ({
      id: subject.id,
      title: subject.subject_name,
      topicsCount: subject.topics?.length ?? 0,
      icon: SUBJECT_ICONS[subject.id],
    }));
}

export default function MobileHomepage() {
  const subjects = getSubjects();

  return (
    <main className="MobileHomepage">
      <section className="MobileHomepageGrid">
        {subjects.map((subject) => (
          <Link
            key={subject.id}
            to={`/subject/${subject.id}`}
            className="MobileHomepageCard"
          >
            <span className="MobileHomepageIcon">
              <SubjectIcon name={subject.icon} />
            </span>

            <span className="MobileHomepageCardTitle">
              {subject.title}
            </span>

            <span className="MobileHomepageCardCount">
              {formatTopicsCount(subject.topicsCount)}
            </span>
          </Link>
        ))}
      </section>
    </main>
  );
}

function SubjectIcon({ name }) {
  switch (name) {
    case "math":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M8 17L24 8L40 17L24 26L8 17Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M14 21V31C14 33 18.5 36 24 36C29.5 36 34 33 34 31V21"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "history":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M10 12C15 12 20 13 24 18C28 13 33 12 38 12V36C33 36 28 37 24 42C20 37 15 36 10 36V12Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M24 18V42"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    case "ukrainian":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M10 35C6.5 31.8 5 27.9 5 23.8C5 13.8 13.5 6 24 6C34.5 6 43 13.8 43 23.8C43 33.8 34.5 41.6 24 41.6C20.5 41.6 17.2 40.7 14.5 39.1L7 41L10 35Z"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <text
            x="24"
            y="29"
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fill="currentColor"
          >
            UA
          </text>
        </svg>
      );

    case "english":
      return (
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M8 16H25"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M16 10V16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M13 30C18 25 21 20 22 16"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M10 23C14 26.5 18 29 23 31"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M28 37L34 20L40 37"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M30.5 31H37.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      );

    default:
      return null;
  }
}