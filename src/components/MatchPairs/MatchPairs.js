import { useEffect, useMemo, useRef, useState } from "react";

export default function MatchPairs({ num, question, image, pairs, onAnswer }) {
    const [selections, setSelections] = useState({});
    const [checked, setChecked] = useState(false);
    const [openIndex, setOpenIndex] = useState(null);
    const rootRef = useRef(null);

    const options = useMemo(() => pairs.map((p) => p.right), [pairs]);
    const allSelected = pairs.every((_, i) => selections[i]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (!rootRef.current || rootRef.current.contains(event.target)) return;
            setOpenIndex(null);
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setOpenIndex(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function selectOption(index, option) {
        if (checked) return;

        setSelections((prev) => ({
            ...prev,
            [index]: option,
        }));

        setOpenIndex(null);
    }

    function toggleDropdown(index) {
        if (checked) return;
        setOpenIndex((prev) => (prev === index ? null : index));
    }

    function check() {
        if (checked || !allSelected) return;

        const correct = pairs.every((p, i) => selections[i] === p.right);

        setChecked(true);
        setOpenIndex(null);
        onAnswer?.(correct);
    }

    const isAllCorrect = checked && pairs.every((p, i) => selections[i] === p.right);

    return (
        <div className="questionCard" ref={rootRef}>
            <div className="questionHeader">
                <div className="questionNum">{num}</div>
                <div className="questionBadge">Встановіть відповідність</div>
                <div className="questionPoints">1 бал</div>
            </div>

            <p className="questionText" dangerouslySetInnerHTML={{ __html: question }} />

            {image && <img src={image} alt="" className="questionImage" />}

            <div className="matchList">
                {pairs.map((pair, i) => {
                    const selectedValue = selections[i] || "";
                    const isCorrect = checked && selectedValue === pair.right;
                    const isWrong = checked && selectedValue !== pair.right;

                    return (
                        <div key={`${pair.left}-${i}`} className="matchRow">
                            <span className="matchLeft">{pair.left}</span>

                            <div className="matchDropdown">
                                <button
                                    type="button"
                                    className={`matchDropdownButton${openIndex === i ? " open" : ""}${isCorrect ? " matchCorrect" : isWrong ? " matchWrong" : ""}`}
                                    disabled={checked}
                                    onClick={() => toggleDropdown(i)}
                                    aria-haspopup="listbox"
                                    aria-expanded={openIndex === i}
                                >
                                    <span className={selectedValue ? "matchDropdownValue" : "matchDropdownPlaceholder"}>
                                        {selectedValue || "— оберіть —"}
                                    </span>

                                    <svg
                                        className="matchDropdownIcon"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                    >
                                        <path
                                            d="M6 9L12 15L18 9"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                {openIndex === i && (
                                    <div className="matchDropdownMenu" role="listbox">
                                        {options.map((opt, optIndex) => (
                                            <button
                                                key={`${opt}-${optIndex}`}
                                                type="button"
                                                className={`matchDropdownOption${selectedValue === opt ? " selected" : ""}`}
                                                onClick={() => selectOption(i, opt)}
                                                role="option"
                                                aria-selected={selectedValue === opt}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

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
                    <div className={`feedback ${isAllCorrect ? "feedbackCorrect" : "feedbackWrong"}`}>
                        {isAllCorrect ? "✓ Правильно!" : "✗ Є помилки. Перевірте відповіді вище."}
                    </div>
                )}
            </div>
        </div>
    );
}