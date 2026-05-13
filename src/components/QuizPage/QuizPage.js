import { useParams, useNavigate } from "react-router-dom";
import { questionsBySubject } from "../../data/index";
import MultipleChoice from "../MultipleChoice/MultipleChoice";
import MatchPairs from "../MatchPairs/MatchPairs";
import ManualInput from "../ManualInput/ManualInput";
import "./QuizPage.css";
import { useState, useCallback, useRef } from "react";

const SUBJECT_KEY = {
    "1": "math",
    "2": "ukrainian",
    "3": "history",
    "4": "english",
};

const SUBJECT_NAMES = {
    "1": "Математика",
    "2": "Українська мова",
    "3": "Історія України",
    "4": "Англійська мова",
};

const DEFAULT_LETTER_IDS = ["А", "Б", "В", "Г", "Д", "Е", "Є", "Ж", "З", "И", "І", "Ї"];

function saveResult({ subjectId, topicId, correct, total }) {
    const STORAGE_KEY = "quiz_results";
    const raw = localStorage.getItem(STORAGE_KEY);
    const results = raw ? JSON.parse(raw) : [];

    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        subjectId,
        topicId,
        topicTitle: `${SUBJECT_NAMES[subjectId] || "Предмет"}, Тема ${topicId}`,
        score: correct,
        total,
        percent: total > 0 ? Math.round((correct / total) * 100) : 0,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...results]));
}

function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getOptionRawText(option) {
    if (typeof option === "object" && option !== null) {
        return String(option.text ?? option.label ?? option.value ?? "");
    }

    return String(option ?? "");
}

function inferOptionId(option, index, fallbackType = "letter") {
    if (typeof option === "object" && option !== null && option.id !== undefined) {
        return String(option.id).trim();
    }

    const rawText = getOptionRawText(option).trim();

    const letterMatch = rawText.match(/^([А-ЯІЇЄҐ])[\s.)]+/u);
    if (letterMatch) return letterMatch[1];

    const numberMatch = rawText.match(/^(\d+)[\s.)]+/u);
    if (numberMatch) return numberMatch[1];

    if (fallbackType === "number") {
        return String(index + 1);
    }

    return DEFAULT_LETTER_IDS[index] || String(index + 1);
}

function cleanOptionText(text, id) {
    if (!text) return "";

    let cleaned = String(text).trim();

    if (id !== undefined && id !== null && String(id).trim() !== "") {
        const escapedId = escapeRegExp(String(id).trim());

        cleaned = cleaned
            .replace(new RegExp(`^${escapedId}\\s*[.)]?\\s*`, "u"), "")
            .trim();
    }

    return cleaned
        .replace(/^[А-ЯІЇЄҐ]\s*[.)]?\s+/u, "")
        .replace(/^\d+\s*[.)]\s*/u, "")
        .trim();
}

function cleanMatchQuestionText(questionText) {
    return String(questionText || "")
        .split("\n")
        .filter((line) => !/^\s*\d+\s*[.)]\s*/u.test(line))
        .join("\n")
        .trim();
}

function normalizeAnswerIds(answer) {
    if (Array.isArray(answer)) {
        return answer.map((item) => String(item).trim()).filter(Boolean);
    }

    if (answer === undefined || answer === null) {
        return [];
    }

    return String(answer)
        .split(/[,;]\s*/u)
        .map((item) => item.trim())
        .filter(Boolean);
}

function getMultipleCorrectIds(question) {
    if (Array.isArray(question.correct_answers)) {
        return new Set(normalizeAnswerIds(question.correct_answers));
    }

    return new Set(normalizeAnswerIds(question.answer));
}

function normalizeMultipleOptions(question) {
    const rawOptions = Array.isArray(question.options) ? question.options : [];
    const correctIds = getMultipleCorrectIds(question);

    const options = rawOptions.map((option, index) => {
        const id = inferOptionId(option, index, "letter");
        const rawText = getOptionRawText(option);

        return {
            id,
            text: cleanOptionText(rawText, id),
            correct: correctIds.has(id),
        };
    });

    validateMultipleQuestion(question, options, correctIds);

    return options;
}

function parseMatchAnswer(question) {
    if (
        question.correct_pairs &&
        typeof question.correct_pairs === "object" &&
        !Array.isArray(question.correct_pairs)
    ) {
        return Object.fromEntries(
            Object.entries(question.correct_pairs).map(([leftId, rightId]) => [
                String(leftId).trim(),
                String(rightId).trim(),
            ])
        );
    }

    const pairs = {};

    if (!question.answer) return pairs;

    String(question.answer)
        .split(/[;,]\s*/u)
        .forEach((part) => {
            const match = part.trim().match(/^(\d+)\s*[-—]\s*([А-ЯІЇЄҐ0-9]+)/u);

            if (match) {
                pairs[match[1]] = match[2];
            }
        });

    return pairs;
}

function normalizeLeftOptions(question) {
    if (Array.isArray(question.left_options)) {
        return question.left_options.map((item, index) => {
            const id = inferOptionId(item, index, "number");
            const rawText = getOptionRawText(item);

            return {
                id,
                text: cleanOptionText(rawText, id),
            };
        });
    }

    const lines = String(question.question || "").split("\n");

    const extracted = lines
        .map((line) => {
            const match = line.trim().match(/^(\d+)\s*[.)]\s*(.+)$/u);

            if (!match) return null;

            return {
                id: match[1],
                text: cleanOptionText(match[2], match[1]),
            };
        })
        .filter(Boolean);

    if (extracted.length > 0) {
        return extracted;
    }

    const correctPairs = parseMatchAnswer(question);

    return Object.keys(correctPairs).map((id) => ({
        id,
        text: "",
    }));
}

function normalizeRightOptions(question) {
    const source = Array.isArray(question.right_options)
        ? question.right_options
        : Array.isArray(question.options)
            ? question.options
            : [];

    return source.map((item, index) => {
        const id = inferOptionId(item, index, "letter");
        const rawText = getOptionRawText(item);

        return {
            id,
            text: cleanOptionText(rawText, id),
        };
    });
}

function normalizeMatchQuestion(question) {
    const leftOptions = normalizeLeftOptions(question);
    const rightOptions = normalizeRightOptions(question);
    const correctPairs = parseMatchAnswer(question);

    const rightById = Object.fromEntries(
        rightOptions.map((item) => [item.id, item])
    );

    const pairs = leftOptions.map((leftItem) => {
        const rightId = correctPairs[leftItem.id];
        const rightItem = rightById[rightId];

        return {
            leftId: leftItem.id,
            left: leftItem.text
                ? `${leftItem.id}. ${leftItem.text}`
                : `${leftItem.id}.`,
            rightId,
            right: rightItem ? rightItem.text : "",
        };
    });

    validateMatchQuestion(question, leftOptions, rightOptions, correctPairs);

    return {
        leftOptions,
        rightOptions,
        correctPairs,
        pairs,

        // Для старого MatchPairs, если он ожидает массив строк
        allOptions: rightOptions.map((item) => item.text),
    };
}

function validateMultipleQuestion(question, options, correctIds) {
    if (!correctIds || correctIds.size === 0) {
        console.warn(`[Quiz validation] У питання ${question.id} немає правильної відповіді.`);
        return;
    }

    const optionIds = new Set(options.map((option) => option.id));

    correctIds.forEach((id) => {
        if (!optionIds.has(id)) {
            console.warn(
                `[Quiz validation] У питання ${question.id} відповідь "${id}" не знайдена серед варіантів.`,
                {
                    question,
                    optionIds: Array.from(optionIds),
                }
            );
        }
    });
}

function validateMatchQuestion(question, leftOptions, rightOptions, correctPairs) {
    const leftIds = new Set(leftOptions.map((item) => item.id));
    const rightIds = new Set(rightOptions.map((item) => item.id));

    Object.entries(correctPairs).forEach(([leftId, rightId]) => {
        if (!leftIds.has(leftId)) {
            console.warn(
                `[Quiz validation] У match-питанні ${question.id} leftId "${leftId}" не знайдений у left_options.`,
                {
                    question,
                    leftIds: Array.from(leftIds),
                }
            );
        }

        if (!rightIds.has(rightId)) {
            console.warn(
                `[Quiz validation] У match-питанні ${question.id} rightId "${rightId}" не знайдений у right_options.`,
                {
                    question,
                    rightIds: Array.from(rightIds),
                }
            );
        }
    });
}

function buildComponentProps(question) {
    const base = {
        num: question.id,
        question:
            question.type === "match"
                ? cleanMatchQuestionText(question.question)
                : question.question,
        image: question.image_url ? `/${question.image_url}` : null,
    };

    if (question.type === "multiple") {
        return {
            ...base,
            options: normalizeMultipleOptions(question),
        };
    }

    if (question.type === "match") {
        const matchData = normalizeMatchQuestion(question);

        return {
            ...base,
            ...matchData,
        };
    }

    return {
        ...base,
        answer: question.answer,
    };
}

export default function QuizPage() {
    const { subjectId, topicId } = useParams();
    const navigate = useNavigate();

    const questionsData = questionsBySubject[SUBJECT_KEY[subjectId]] ?? [];

    const questions = questionsData.filter(
        (q) => String(q.topic_id) === String(topicId)
    );

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const savedRef = useRef(false);

    const handleAnswer = useCallback((index, correct) => {
        setAnswers((prev) => ({
            ...prev,
            [index]: Boolean(correct),
        }));
    }, []);

    const answered = Object.keys(answers).length;
    const correct = Object.values(answers).filter(Boolean).length;

    function finish() {
        if (!savedRef.current) {
            savedRef.current = true;

            saveResult({
                subjectId,
                topicId,
                correct,
                total: questions.length,
            });
        }

        setShowResult(true);
    }

    if (questions.length === 0) {
        return (
            <div className="quizPage">
                <div className="emptyState">
                    <p>Питання для цієї теми не знайдено.</p>

                    <button
                        className="resultBack"
                        onClick={() => navigate(-1)}
                    >
                        ← Назад
                    </button>
                </div>
            </div>
        );
    }

    if (showResult) {
        const pct = Math.round((correct / questions.length) * 100);

        return (
            <div className="quizPage">
                <div className="quizResult">
                    <div className="resultScore">{pct}%</div>

                    <div className="resultLabel">
                        Правильно {correct} із {questions.length} питань
                    </div>

                    <button
                        className="resultBack"
                        onClick={() => navigate(-1)}
                    >
                        ← Повернутися
                    </button>
                </div>
            </div>
        );
    }

    const q = questions[current];
    const props = buildComponentProps(q);

    const onAnswer = (isCorrect) => {
        handleAnswer(current, isCorrect);
    };

    const dotStatus = (i) => {
        if (i === current) return "progressDot dotActive";
        if (answers[i] === true) return "progressDot dotCorrect";
        if (answers[i] === false) return "progressDot dotWrong";
        return "progressDot";
    };

    return (
        <div className="quizPage">
            <div className="progressBar">
                <div className="progressLabel">Питання</div>

                <div className="progressDots">
                    {questions.map((_, i) => (
                        <button
                            key={i}
                            className={dotStatus(i)}
                            onClick={() => setCurrent(i)}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>

            <div className="quizBody">
                {q.type === "multiple" && (
                    <MultipleChoice
                        key={`${q.id}-${current}`}
                        {...props}
                        onAnswer={onAnswer}
                    />
                )}

                {q.type === "match" && (
                    <MatchPairs
                        key={`${q.id}-${current}`}
                        {...props}
                        onAnswer={onAnswer}
                    />
                )}

                {q.type !== "multiple" && q.type !== "match" && (
                    <ManualInput
                        key={`${q.id}-${current}`}
                        {...props}
                        onAnswer={onAnswer}
                    />
                )}
            </div>

            <div className="quizNav">
                <button
                    className="navBtn"
                    onClick={() => setCurrent((prev) => prev - 1)}
                    disabled={current === 0}
                >
                    ← <span>Попереднє</span>
                </button>

                <span className="navProgress">
                    {answered}/{questions.length}
                </span>

                {current < questions.length - 1 ? (
                    <button
                        className="navBtn"
                        onClick={() => setCurrent((prev) => prev + 1)}
                    >
                        <span>Наступне</span> →
                    </button>
                ) : (
                    <button
                        className="navBtn finishBtn"
                        onClick={finish}
                    >
                        ✓ <span>Завершити тест</span>
                    </button>
                )}
            </div>
        </div>
    );
}