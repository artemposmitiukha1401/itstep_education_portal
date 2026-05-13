import { useState } from "react";

export default function ManualInput({ num, question, image, answer, onAnswer }) {
    const [value, setValue] = useState("");
    const [result, setResult] = useState(null);

    function check() {
        if (result !== null) return;
        const correct = value.trim().toLowerCase() === answer.trim().toLowerCase();
        setResult(correct);
        onAnswer?.(correct);
    }

    return (
        <div className="questionCard">
            <div className="questionHeader">
                <div className="questionNum">{num}</div>
                <div className="questionBadge">Введіть відповідь</div>
                <div className="questionPoints">1 бал</div>
            </div>

            <p className="questionText" dangerouslySetInnerHTML={{ __html: question }} />

            {image && <img src={image} alt="" className="questionImage" />}

            <div className="answerSelector">
                <div className="manualInput">
                    <input
                        type="text"
                        value={value}
                        disabled={result !== null}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && check()}
                        placeholder="Введіть відповідь..."
                    />
                    <button className="checkBtn" disabled={result !== null || !value.trim()} onClick={check}>
                        Перевірити
                    </button>
                </div>

                {result !== null && (
                    <div className={`feedback ${result ? "feedbackCorrect" : "feedbackWrong"}`}>
                        {result ? "✓ Правильно!" : `✗ Неправильно. Відповідь: ${answer}`}
                    </div>
                )}
            </div>
        </div>
    );
}