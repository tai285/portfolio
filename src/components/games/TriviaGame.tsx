import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { triviaQuestions as staticTriviaQuestions } from "../../data/trivia";
import { useContent } from "../../hooks/useContent";
import type { TriviaContent } from "../../types/content";
import { unlockAchievement } from "../../utils/achievements";

type AnswerState = "unanswered" | "correct" | "wrong";

export function TriviaGame() {
  const { questions: triviaQuestions } = useContent<TriviaContent>("trivia", {
    questions: staticTriviaQuestions,
  });
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = triviaQuestions[Math.min(index, triviaQuestions.length - 1)];
  const state: AnswerState =
    selected === null ? "unanswered" : selected === question.correctIndex ? "correct" : "wrong";

  function selectAnswer(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= triviaQuestions.length) {
      setFinished(true);
      if (score === triviaQuestions.length) unlockAchievement("quiz-whiz");
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <p className="text-4xl" aria-hidden="true">
          🎉
        </p>
        <h3 className="mt-3 text-2xl">
          You scored {score} / {triviaQuestions.length}
        </h3>
        <p className="mt-2 text-[var(--fg-muted)]">
          {score === triviaQuestions.length
            ? "Perfect score — you really were paying attention!"
            : "Not bad! Try again for a perfect score."}
        </p>
        <button
          type="button"
          onClick={restart}
          className="mt-6 cursor-pointer rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
        >
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
      <div className="mb-4 flex items-center justify-between text-xs font-semibold text-[var(--fg-muted)]">
        <span>
          Question {index + 1} / {triviaQuestions.length}
        </span>
        <span>Score: {score}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--bg-alt)]">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ width: `${((index + (selected !== null ? 1 : 0)) / triviaQuestions.length) * 100}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <h3 className="mt-6 text-xl leading-snug">{question.question}</h3>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {question.options.map((option, i) => {
              const isCorrect = i === question.correctIndex;
              const isSelected = i === selected;
              let styles =
                "border-[var(--border)] bg-[var(--bg)] hover:border-primary-light";
              if (selected !== null) {
                if (isCorrect) {
                  styles = "border-success bg-success/15";
                } else if (isSelected) {
                  styles = "border-error bg-error/15";
                } else {
                  styles = "border-[var(--border)] opacity-60";
                }
              }
              return (
                <button
                  key={i}
                  type="button"
                  disabled={selected !== null}
                  onClick={() => selectAnswer(i)}
                  aria-pressed={isSelected}
                  className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl border px-4 py-3 text-left text-sm font-medium text-[var(--fg)] transition-colors duration-200 disabled:cursor-default ${styles}`}
                >
                  {selected !== null && isCorrect && <span aria-hidden="true">✔</span>}
                  {selected !== null && isSelected && !isCorrect && (
                    <span aria-hidden="true">✕</span>
                  )}
                  {option}
                </button>
              );
            })}
          </div>

          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-5 rounded-2xl bg-[var(--bg-alt)] p-4 text-sm text-[var(--fg-muted)]"
            >
              <p className="font-semibold text-[var(--fg)]">
                {state === "correct" ? "Correct! ✔" : "Not quite —"}
              </p>
              <p className="mt-1">{question.explanation}</p>
              <button
                type="button"
                onClick={next}
                className="mt-4 cursor-pointer rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105 active:scale-95"
              >
                {index + 1 >= triviaQuestions.length ? "See results" : "Next question →"}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
