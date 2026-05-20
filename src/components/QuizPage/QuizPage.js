import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { questionsBySubject } from "../../data";
import MultipleChoice from "../MultipleChoice/MultipleChoice";
import MatchPairs from "../MatchPairs/MatchPairs";
import ManualInput from "../ManualInput/ManualInput";
import "./QuizPage.css";

const SUBJECT_KEY = {
  1: "math",
  2: "ukrainian",
  3: "history",
  4: "english",
};

const SUBJECT_NAMES = {
  1: "Математика",
  2: "Українська мова",
  3: "Історія України",
  4: "Англійська мова",
};

const VALID_TYPES = new Set([
  "single-choice",
  "multiple-choice",
  "match",
  "manual",
]);

function safeParseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveResult({ subjectId, topicId, correct, total }) {
  const STORAGE_KEY = "quiz_results";
  const results = safeParseJson(localStorage.getItem(STORAGE_KEY), []);

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

function normalizeText(value) {
  return String(value ?? "").trim();
}

function normalizeId(value) {
  return String(value ?? "").trim();
}

function normalizeImageUrl(imageUrl) {
  if (!imageUrl) return null;

  const value = String(imageUrl).trim();

  if (
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:")
  ) {
    return value;
  }

  return `/${value}`;
}

function validateBaseQuestion(question) {
  if (!question || typeof question !== "object") {
    throw new Error("Invalid question object.");
  }

  if (!question.id) {
    throw new Error("Question is missing id.");
  }

  if (!VALID_TYPES.has(question.type)) {
    throw new Error(
      `Question ${question.id} has invalid type: ${question.type}`,
    );
  }

  if (!question.question || typeof question.question !== "string") {
    throw new Error(`Question ${question.id} has invalid question text.`);
  }

  if (question.topicId === undefined || question.topicId === null) {
    throw new Error(`Question ${question.id} is missing topicId.`);
  }
}

function validateChoiceQuestion(question) {
  if (!Array.isArray(question.options) || question.options.length === 0) {
    throw new Error(`Question ${question.id} must have options.`);
  }

  if (
    !Array.isArray(question.correctOptionIds) ||
    question.correctOptionIds.length === 0
  ) {
    throw new Error(`Question ${question.id} must have correctOptionIds.`);
  }

  const optionIds = new Set(
    question.options.map((option) => normalizeId(option.id)),
  );

  question.options.forEach((option) => {
    if (!option.id) {
      throw new Error(`Question ${question.id} has option without id.`);
    }

    if (!option.text) {
      throw new Error(
        `Question ${question.id} has option ${option.id} without text.`,
      );
    }
  });

  question.correctOptionIds.forEach((id) => {
    if (!optionIds.has(normalizeId(id))) {
      throw new Error(
        `Question ${question.id} has correctOptionId "${id}" that does not exist in options.`,
      );
    }
  });

  if (
    question.type === "single-choice" &&
    question.correctOptionIds.length !== 1
  ) {
    throw new Error(
      `Question ${question.id} is single-choice but has ${question.correctOptionIds.length} correct answers.`,
    );
  }
}

function validateMatchQuestion(question) {
  if (
    !Array.isArray(question.leftOptions) ||
    question.leftOptions.length === 0
  ) {
    throw new Error(`Question ${question.id} must have leftOptions.`);
  }

  if (
    !Array.isArray(question.rightOptions) ||
    question.rightOptions.length === 0
  ) {
    throw new Error(`Question ${question.id} must have rightOptions.`);
  }

  if (
    !question.correctPairs ||
    typeof question.correctPairs !== "object" ||
    Array.isArray(question.correctPairs)
  ) {
    throw new Error(`Question ${question.id} must have correctPairs object.`);
  }

  const leftIds = new Set(
    question.leftOptions.map((option) => normalizeId(option.id)),
  );
  const rightIds = new Set(
    question.rightOptions.map((option) => normalizeId(option.id)),
  );

  question.leftOptions.forEach((option) => {
    if (!option.id) {
      throw new Error(`Question ${question.id} has left option without id.`);
    }

    if (!option.text) {
      throw new Error(
        `Question ${question.id} has left option ${option.id} without text.`,
      );
    }
  });

  question.rightOptions.forEach((option) => {
    if (!option.id) {
      throw new Error(`Question ${question.id} has right option without id.`);
    }

    if (!option.text) {
      throw new Error(
        `Question ${question.id} has right option ${option.id} without text.`,
      );
    }
  });

  Object.entries(question.correctPairs).forEach(([leftId, rightId]) => {
    if (!leftIds.has(normalizeId(leftId))) {
      throw new Error(
        `Question ${question.id} has correctPairs left id "${leftId}" that does not exist.`,
      );
    }

    if (!rightIds.has(normalizeId(rightId))) {
      throw new Error(
        `Question ${question.id} has correctPairs right id "${rightId}" that does not exist.`,
      );
    }
  });
}

function validateManualQuestion(question) {
  if (
    !Array.isArray(question.correctAnswers) ||
    question.correctAnswers.length === 0
  ) {
    throw new Error(`Question ${question.id} must have correctAnswers.`);
  }
}

function validateQuestion(question) {
  validateBaseQuestion(question);

  if (
    question.type === "single-choice" ||
    question.type === "multiple-choice"
  ) {
    validateChoiceQuestion(question);
  }

  if (question.type === "match") {
    validateMatchQuestion(question);
  }

  if (question.type === "manual") {
    validateManualQuestion(question);
  }
}

function normalizeChoiceQuestion(question) {
  const correctIds = new Set(question.correctOptionIds.map(normalizeId));

  const options = question.options.map((option) => ({
    id: normalizeId(option.id),
    label: normalizeText(option.label || option.id),
    text: normalizeText(option.text),
    correct: correctIds.has(normalizeId(option.id)),
  }));

  return {
    ...question,
    options,
    correctOptionIds: question.correctOptionIds.map(normalizeId),
    selectionMode: question.type === "multiple-choice" ? "multiple" : "single",
  };
}

function normalizeMatchQuestion(question) {
  const leftOptions = question.leftOptions.map((option) => ({
    id: normalizeId(option.id),
    label: normalizeText(option.label || option.id),
    text: normalizeText(option.text),
  }));

  const rightOptions = question.rightOptions.map((option) => ({
    id: normalizeId(option.id),
    label: normalizeText(option.label || option.id),
    text: normalizeText(option.text),
  }));

  const correctPairs = Object.fromEntries(
    Object.entries(question.correctPairs).map(([leftId, rightId]) => [
      normalizeId(leftId),
      normalizeId(rightId),
    ]),
  );

  const rightById = Object.fromEntries(
    rightOptions.map((option) => [option.id, option]),
  );

  const pairs = leftOptions.map((leftOption) => {
    const rightId = correctPairs[leftOption.id];
    const rightOption = rightById[rightId];

    return {
      leftId: leftOption.id,
      left: `${leftOption.label}. ${leftOption.text}`,
      rightId,
      right: rightOption ? rightOption.text : "",
    };
  });

  return {
    ...question,
    leftOptions,
    rightOptions,
    correctPairs,
    pairs,
    allOptions: rightOptions.map((option) => option.text),
    allOptionObjects: rightOptions,
  };
}

function normalizeManualQuestion(question) {
  const correctAnswers = question.correctAnswers
    .map(normalizeText)
    .filter(Boolean);

  return {
    ...question,
    correctAnswers,
    answer: correctAnswers[0] || "",
  };
}

function normalizeQuestion(question) {
  validateQuestion(question);

  const base = {
    id: normalizeId(question.id),
    subjectId: question.subjectId ?? null,
    topicId: question.topicId,
    subtopicId: question.subtopicId ?? null,
    type: question.type,
    question: normalizeText(question.question),
    imageUrl: normalizeImageUrl(question.imageUrl),
    explanation: question.explanation ?? null,
  };

  const preparedQuestion = {
    ...question,
    ...base,
  };

  if (
    question.type === "single-choice" ||
    question.type === "multiple-choice"
  ) {
    return normalizeChoiceQuestion(preparedQuestion);
  }

  if (question.type === "match") {
    return normalizeMatchQuestion(preparedQuestion);
  }

  return normalizeManualQuestion(preparedQuestion);
}

function buildComponentProps(question, index) {
  const base = {
    num: index + 1,
    question: question.question,
    image: question.imageUrl,
    explanation: question.explanation,
    type: question.type,
  };

  if (
    question.type === "single-choice" ||
    question.type === "multiple-choice"
  ) {
    return {
      ...base,
      options: question.options,
      correctOptionIds: question.correctOptionIds,
      selectionMode: question.selectionMode,
    };
  }

  if (question.type === "match") {
    return {
      ...base,
      leftOptions: question.leftOptions,
      rightOptions: question.rightOptions,
      correctPairs: question.correctPairs,
      pairs: question.pairs,
      allOptions: question.allOptions,
      allOptionObjects: question.allOptionObjects,
    };
  }

  return {
    ...base,
    answer: question.answer,
    correctAnswers: question.correctAnswers,
  };
}

function getQuestionsForSubject(subjectId) {
  const subjectKey = SUBJECT_KEY[subjectId] ?? subjectId;
  return questionsBySubject[subjectKey] ?? questionsBySubject[subjectId] ?? [];
}

export default function QuizPage() {
  const { subjectId, topicId } = useParams();
  const navigate = useNavigate();

  const rawQuestionsData = getQuestionsForSubject(subjectId);

  const questions = useMemo(() => {
    return rawQuestionsData
      .filter((question) => String(question.topicId) === String(topicId))
      .map(normalizeQuestion);
  }, [rawQuestionsData, topicId]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const savedRef = useRef(false);

  const [slideClass, setSlideClass] = useState("");
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setCurrent(0);
    setAnswers({});
    setShowResult(false);
    setSlideClass("");
    setAnimKey(0);
    savedRef.current = false;
  }, [subjectId, topicId]);

  const handleAnswer = useCallback((index, correct) => {
    setAnswers((prev) => ({
      ...prev,
      [index]: Boolean(correct),
    }));
  }, []);

  const answered = Object.keys(answers).length;
  const correct = Object.values(answers).filter(Boolean).length;

  function goTo(nextIndex, direction) {
    if (
      nextIndex < 0 ||
      nextIndex >= questions.length ||
      nextIndex === current
    ) {
      return;
    }

    setSlideClass(direction === "next" ? "slideOutLeft" : "slideOutRight");

    setTimeout(() => {
      setCurrent(nextIndex);
      setSlideClass(direction === "next" ? "slideInRight" : "slideInLeft");
      setAnimKey((key) => key + 1);

      setTimeout(() => {
        setSlideClass("");
      }, 350);
    }, 200);
  }

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

          <button className="resultBack" onClick={() => navigate(-1)}>
            <span className="resultBackText">Назад</span>

            <svg
              className="resultBackArrow"
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

          <button className="resultBack" onClick={() => navigate(-1)}>
            <span className="resultBackText">Повернутися</span>

            <svg
              className="resultBackArrow"
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
          </button>

          <Link className="resultBack resultHistoryBtn" to="/history">
            <span className="resultBackText">Результати</span>

            <svg
              className="resultBackArrow resultHistoryArrow"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M16 13H8M16 17H8M10 9H8M14 2H8.8C7.11984 2 6.27976 2 5.63803 2.32698C5.07354 2.6146 4.6146 3.07354 4.32698 3.63803C4 4.27976 4 5.11984 4 6.8V17.2C4 18.8802 4 19.7202 4.32698 20.362C4.6146 20.9265 5.07354 21.3854 5.63803 21.673C6.27976 22 7.11984 22 8.8 22H15.2C16.8802 22 17.7202 22 18.362 21.673C18.9265 21.3854 19.3854 20.9265 19.673 20.362C20 19.7202 20 18.8802 20 17.2V8L14 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const props = buildComponentProps(q, current);

  const onAnswer = (isCorrect) => {
    handleAnswer(current, isCorrect);
  };

  const dotStatus = (index) => {
    if (index === current) return "progressDot dotActive";
    if (answers[index] === true) return "progressDot dotCorrect";
    if (answers[index] === false) return "progressDot dotWrong";
    return "progressDot";
  };

  return (
    <div className="quizPage">
      <Link className="quizBackBtn" to={`/subject/${subjectId}`}>
        <span className="quizBackBtnText">До тем</span>

        <svg
          className="quizBackBtnArrow"
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

      <div className="progressBar">
        <div className="progressLabel">Питання</div>

        <div className="progressDots">
          {questions.map((question, index) => (
            <button
              key={question.id}
              className={dotStatus(index)}
              onClick={() => goTo(index, index > current ? "next" : "prev")}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="quizBody">
        <div key={animKey} className={`quizSlide ${slideClass}`}>
          {(q.type === "single-choice" || q.type === "multiple-choice") && (
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

          {q.type === "manual" && (
            <ManualInput
              key={`${q.id}-${current}`}
              {...props}
              onAnswer={onAnswer}
            />
          )}
        </div>
      </div>

      <div className="quizNav">
        <button
          className="navBtn navBtnPrev"
          onClick={() => goTo(current - 1, "prev")}
          disabled={current === 0}
        >
          <span className="navBtnText">Попереднє</span>

          <svg
            className="navBtnArrow"
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
        </button>

        <span className="navProgress">
          {answered}/{questions.length}
        </span>

        {current < questions.length - 1 ? (
          <button
            className="navBtn navBtnNext"
            onClick={() => goTo(current + 1, "next")}
          >
            <span className="navBtnText">Наступне</span>

            <svg
              className="navBtnArrow"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="#103058"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        ) : (
          <button className="navBtn navBtnFinish" onClick={finish}>
            <span className="navBtnText">Завершити</span>

            <svg
              className="navBtnArrow"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="#103058"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
