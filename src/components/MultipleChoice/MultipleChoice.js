import { useState } from "react";

const LETTERS = ["А", "Б", "В", "Г", "Д"];

export default function MultipleChoice({ num, question, image, options, onAnswer }) {
    const [picked, setPicked] = useState(null);

    function choose(idx) {
        if (picked !== null) return;
        setPicked(idx);
        onAnswer?.(options[idx].correct);
    }

    return (
        <div className="questionCard">
            <div className="questionHeader">
                <div className="questionNum">{num}</div>
                <div className="questionBadge">Оберіть одну правильну відповідь</div>
                <div className="questionPoints">1 бал</div>
            </div>

            <p className="questionText" dangerouslySetInnerHTML={{ __html: question }} />

            {image && <img src={image} alt="" className="questionImage" />}

            <ul className="optionsList">
                {options.map((opt, i) => {
                    let cls = "optionItem";
                    if (picked !== null) {
                        if (opt.correct) cls += " optionCorrect";
                        else if (picked === i) cls += " optionWrong";
                    }
                    return (
                        <li key={i}>
                            <button className={cls} disabled={picked !== null} onClick={() => choose(i)}>
                                <span className="optionLetter">{LETTERS[i]}</span>
                                {opt.text}
                            </button>
                        </li>
                    );
                })}
            </ul>

            <div className="answerSelector">
                <div className="answerLabel">Оберіть відповідь:</div>
                <div className="answerButtons">
                    {options.map((opt, i) => {
                        let cls = "answerBtn";
                        if (picked !== null) {
                            if (opt.correct) cls += " answerCorrect";
                            else if (picked === i) cls += " answerWrong";
                        } else if (picked === i) {
                            cls += " answerSelected";
                        }
                        return (
                            <button
                                key={i}
                                className={cls}
                                disabled={picked !== null}
                                onClick={() => choose(i)}
                            >
                                {LETTERS[i]}
                            </button>
                        );
                    })}
                </div>
                <button className="explainBtn">Показати пояснення</button>
            </div>
        </div>
    );
}