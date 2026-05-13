import { useState } from "react";

export default function MatchPairs({ num, question, image, pairs, onAnswer }) {
    const [selections, setSelections] = useState({});
    const [checked, setChecked] = useState(false);

    const options = pairs.map((p) => p.right);
    const allSelected = pairs.every((_, i) => selections[i]);

    function check() {
        if (checked || !allSelected) return;
        const correct = pairs.every((p, i) => selections[i] === p.right);
        setChecked(true);
        onAnswer?.(correct);
    }

    const isAllCorrect = checked && pairs.every((p, i) => selections[i] === p.right);

    return (
        <div className="questionCard">
            <div className="questionHeader">
                <div className="questionNum">{num}</div>
                <div className="questionBadge">Встановіть відповідність</div>
                <div className="questionPoints">1 бал</div>
            </div>

            <p className="questionText" dangerouslySetInnerHTML={{ __html: question }} />

            {image && <img src={image} alt="" className="questionImage" />}

            <div style={{ marginBottom: 20 }}>
                {pairs.map((pair, i) => {
                    const isCorrect = checked && selections[i] === pair.right;
                    const isWrong = checked && selections[i] !== pair.right;
                    return (
                        <div key={i} className="matchRow">
                            <span className="matchLeft">{pair.left}</span>
                            <select
                                value={selections[i] || ""}
                                disabled={checked}
                                className={`matchSelect${isCorrect ? " matchCorrect" : isWrong ? " matchWrong" : ""}`}
                                onChange={(e) => setSelections({ ...selections, [i]: e.target.value })}
                            >
                                <option value="">— оберіть —</option>
                                {options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            {checked && isWrong && (
                                <span className="matchHint">→ {pair.right}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="answerSelector">
                <button
                    className="checkBtn"
                    disabled={checked || !allSelected}
                    onClick={check}
                >
                    Перевірити
                </button>

                {checked && (
                    <div className={`feedback ${isAllCorrect ? "feedbackCorrect" : "feedbackWrong"}`}
                         style={{ marginTop: 12 }}>
                        {isAllCorrect ? "✓ Правильно!" : "✗ Є помилки. Перевірте відповіді вище."}
                    </div>
                )}
            </div>
        </div>
    );
}