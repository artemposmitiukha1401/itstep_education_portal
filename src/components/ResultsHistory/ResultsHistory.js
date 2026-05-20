import { useEffect, useState } from "react";import { Link } from "react-router-dom";import "./ResultsHistory.css";

const STORAGE_KEY = "quiz_results";

function formatDate(iso) {const d = new Date(iso);

return d.toLocaleString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

}

function ScoreRing({ percent }) {const r = 22;const circ = 2 * Math.PI * r;const dash = (percent / 100) * circ;

const color =
    percent >= 80
        ? "#16a34a"
        : percent >= 50
          ? "#facc15"
          : "#dc2626";

return (
    <svg className="resultRing" viewBox="0 0 56 56" width="56" height="56">
        <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="5"
        />

        <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 28 28)"
        />

        <text
            x="28"
            y="33"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill={color}
        >
            {percent}%
        </text>
    </svg>
);

}

function HistoryCard({ entry, onDelete }) {const label =entry.percent >= 80? "Відмінно": entry.percent >= 50? "Добре": "Потрібно повторити";

return (
    <article className="resultCard">
        <div className="resultCardHeader">
            <ScoreRing percent={entry.percent} />

            <div className="resultInfo">
                <span className="resultLabel">{label}</span>

                {entry.topicTitle && (
                    <div className="resultTags">
                        <span className="resultTag">{entry.topicTitle}</span>
                    </div>
                )}

                <span className="resultMeta">
                    {entry.score} / {entry.total} правильних
                </span>

                <span className="resultDate">{formatDate(entry.date)}</span>
            </div>

            <button
                type="button"
                className="resultDeleteBtn"
                title="Видалити"
                onClick={() => onDelete(entry.id)}
            >
                ✕
            </button>
        </div>
    </article>
);

}

export default function QuizHistory() {const [results, setResults] = useState([]);

useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return;

    try {
        setResults(JSON.parse(raw));
    } catch {
        setResults([]);
    }
}, []);

function handleDelete(id) {
    const updated = results.filter((result) => result.id !== id);

    setResults(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}


function handleClearAll() {
    if (!window.confirm("Видалити всю історію результатів?")) return;

    setResults([]);
    localStorage.removeItem(STORAGE_KEY);
}

const avgPercent = results.length
    ? Math.round(results.reduce((sum, result) => sum + result.percent, 0) / results.length)
    : 0;

const excellentCount = results.filter((result) => result.percent >= 80).length;

return (
    <main className="resultsPage">
        <Link to="/home" className="resultsBackBtn">
            <span className="resultsBackText">Предмети</span>

            <svg
                className="resultsBackIcon"
                width="100%"
                height="100%"
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M19 12H5M5 12L12 19M5 12L12 5"
                    stroke="#103058"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </Link>

        <header className="resultsHeader">
            <h1 className="resultsTitle">Історія результатів</h1>

            {results.length > 0 && (
                <div className="resultsSummary">
                    <div className="resultStat">
                        <span className="resultStatValue">{results.length}</span>
                        <span className="resultStatLabel">спроб</span>
                    </div>

                    <div className="resultStat">
                        <span className="resultStatValue">{avgPercent}%</span>
                        <span className="resultStatLabel">середній результат</span>
                    </div>

                    <div className="resultStat">
                        <span className="resultStatValue">{excellentCount}</span>
                        <span className="resultStatLabel">відмінних</span>
                    </div>
                </div>
            )}
        </header>

        {results.length > 0 && (
            <div className="resultsControls">
                <button
                    type="button"
                    className="resultsClearBtn"
                    onClick={handleClearAll}
                >
                    <span className="resultsClearText">Очистити все</span>

                    <svg
                        className="resultsClearIcon"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M4 7H20M10 11V17M14 11V17M6 7L7 21H17L18 7M9 7V4H15V7"
                            stroke="#103058"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        )}

        <section className="resultsList">
            {results.length === 0 ? (
                <div className="resultsEmpty">
                    Ви ще не проходили жодного тесту.
                </div>
            ) : (
                results.map((entry) => (
                    <HistoryCard
                        key={entry.id}
                        entry={entry}
                        onDelete={handleDelete}
                    />
                ))
            )}
        </section>
    </main>
);

}