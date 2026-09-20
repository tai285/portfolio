import { triviaQuestions as staticTrivia } from "../../data/trivia";
import { useAdminContentDoc } from "../../hooks/useAdminContentDoc";
import type { TriviaContent, TriviaQuestion } from "../../types/content";
import { Field, SaveBar, TextArea, TextInput } from "./fields";
import { ListEditor } from "./ListEditor";

export function TriviaEditor() {
  const { value, setValue, loading, saving, saved, error, save } =
    useAdminContentDoc<TriviaContent>("trivia", { questions: staticTrivia });

  if (loading) return <p className="text-sm text-[var(--fg-muted)]">Loading…</p>;

  return (
    <div className="space-y-4 pb-24">
      <ListEditor<TriviaQuestion>
        items={value.questions}
        onChange={(questions) => setValue({ questions })}
        addLabel="+ Add question"
        itemLabel={(q, i) => q.question || `Question ${i + 1}`}
        makeNew={() => ({
          question: "",
          options: ["", "", "", ""],
          correctIndex: 0,
          explanation: "",
        })}
        renderItem={(q, update, qi) => (
          <div className="space-y-3">
            <Field label="Question">
              <TextInput
                value={q.question}
                onChange={(e) => update({ question: e.target.value })}
              />
            </Field>
            <Field label="Options (mark the correct one below)">
              <div className="space-y-2">
                {q.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qi}`}
                      checked={q.correctIndex === i}
                      onChange={() => update({ correctIndex: i })}
                      aria-label={`Option ${i + 1} is correct`}
                    />
                    <TextInput
                      value={opt}
                      onChange={(e) => {
                        const options = [...q.options];
                        options[i] = e.target.value;
                        update({ options });
                      }}
                    />
                  </div>
                ))}
              </div>
            </Field>
            <Field label="Explanation (shown after answering)">
              <TextArea
                rows={2}
                value={q.explanation}
                onChange={(e) => update({ explanation: e.target.value })}
              />
            </Field>
          </div>
        )}
      />

      {error && <p className="text-sm text-error">{error}</p>}
      <SaveBar onSave={save} saving={saving} saved={saved} />
    </div>
  );
}
