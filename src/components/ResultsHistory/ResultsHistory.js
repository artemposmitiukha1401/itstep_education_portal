import { useEffect, useState } from "react";
import "./ResultsHistory.css";

const STORAGE_KEY = "quiz_results";

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function ScoreRing({ percent }) {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const dash = (percent / 100) * circ;

    const color =
        percent >= 80 ? "#4ade80"
            : percent >= 50 ? "#facc15"
                : "#f87171";

    return (
        <svg className="qh-ring" viewBox="0 0 56 56" width="56" height="56">
            <circle cx="28" cy="28" r={r} fill="none" stroke="#ffffff18" strokeWidth="5" />
            <circle
                cx="28" cy="28" r={r}
                fill="none"
                stroke={color}
                strokeWidth="5"
                strokeDasharray={`${dash} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
                style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
            <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>
                {percent}%
            </text>
        </svg>
    );
}

function HistoryEntry({ entry, onDelete }) {
    const label =
        entry.percent >= 80 ? "Відмінно" :
            entry.percent >= 50 ? "Добре" : "Потрібно повторити";

    return (
        <div className="qh-entry">
            <div className="qh-entry-header">
                <ScoreRing percent={entry.percent} />
                <div className="qh-entry-info">
                    <span className="qh-entry-label">{label}</span>
                    {entry.topicTitle && (
                        <span className="qh-entry-titles">
                            <span className="qh-tag">{entry.topicTitle}</span>
                        </span>
                    )}
                    <span className="qh-entry-meta">{entry.score} / {entry.total} правильних</span>
                    <span className="qh-entry-date">{formatDate(entry.date)}</span>
                </div>
                <button
                    className="qh-delete-btn"
                    title="Видалити"
                    onClick={() => onDelete(entry.id)}
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default function QuizHistory() {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try { setResults(JSON.parse(raw)); }
            catch { setResults([]); }
        }
    }, []);

    function handleDelete(id) {
        const updated = results.filter((r) => r.id !== id);
        setResults(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }

    function handleClearAll() {
        if (window.confirm("Видалити всю історію результатів?")) {
            setResults([]);
            localStorage.removeItem(STORAGE_KEY);
        }
    }

    const avgPercent = results.length
        ? Math.round(results.reduce((s, r) => s + r.percent, 0) / results.length)
        : null;

    return (
        <div className="qh-page">
            <header className="qh-header">
                <h1 className="qh-title">Історія результатів</h1>
                {results.length > 0 && (
                    <div className="qh-summary">
                        <div className="qh-stat">
                            <span className="qh-stat-val">{results.length}</span>
                            <span className="qh-stat-key">спроб</span>
                        </div>
                        <div className="qh-stat">
                            <span className="qh-stat-val">{avgPercent}%</span>
                            <span className="qh-stat-key">середній результат</span>
                        </div>
                        <div className="qh-stat">
                            <span className="qh-stat-val">
                                {results.filter((r) => r.percent >= 80).length}
                            </span>
                            <span className="qh-stat-key">відмінних</span>
                        </div>
                    </div>
                )}
            </header>

            {results.length > 0 && (
                <div className="qh-controls">
                    <button className="qh-clear-btn" onClick={handleClearAll}>
                        Очистити все
                    </button>
                </div>
            )}

            <div className="qh-list">
                {results.length === 0 ? (
                    <div className="qh-empty">Ви ще не проходили жодного тесту.</div>
                ) : (
                    results.map((entry) => (
                        <HistoryEntry key={entry.id} entry={entry} onDelete={handleDelete} />
                    ))
                )}
            </div>
        </div>
    );
}