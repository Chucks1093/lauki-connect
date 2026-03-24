import { useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/button.tsx';
import { Textarea } from '../ui/textarea.tsx';

type RequestFormProps = {
  onSubmit: (values: { goal: string; requester: string }) => Promise<void> | void;
};

export function RequestForm({ onSubmit }: RequestFormProps) {
  const [goal, setGoal] = useState('');
  const [requester, setRequester] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ goal, requester });
      setGoal('');
      setRequester('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-black/15 backdrop-blur-sm sm:p-8"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200/90">
              Request form
            </p>
            <h3 className="mt-3 font-grotesque text-3xl font-semibold tracking-tight text-white">
              Describe the introduction you need
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
              Keep it direct. State who you need, the context, and the reason this connection
              matters.
            </p>
          </div>

          <label className="grid gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Goal
            </span>
            <Textarea
              className="min-h-44 rounded-[24px] border-white/10 bg-white/[0.04] px-5 py-4 text-base text-white placeholder:text-slate-500 focus-visible:border-amber-300/50 focus-visible:ring-amber-300/20"
              name="goal"
              placeholder="I need a backend engineer with startup experience who has shipped fintech systems in Africa."
              required
              rows={6}
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
            />
          </label>
        </div>

        <div className="space-y-6">
          <label className="grid gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Requester
            </span>
            <input
              className="h-12 rounded-[20px] border border-white/10 bg-white/[0.04] px-4 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-amber-300/50 focus:ring-4 focus:ring-amber-300/12"
              name="requester"
              placeholder="Sebastain"
              value={requester}
              onChange={(event) => setRequester(event.target.value)}
            />
          </label>

          <div className="rounded-[28px] border border-cyan-300/12 bg-cyan-400/[0.07] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100/80">
              Good prompt pattern
            </p>
            <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
              <p>Who you need.</p>
              <p>Why the intro matters now.</p>
              <p>Any market, stage, or geography constraint.</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Example inputs
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                'AI founder for a warm intro',
                'Investors interested in creator tools',
                'Growth lead for an early-stage startup',
              ].map((example) => (
                <button
                  key={example}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-white/20 hover:bg-white/8 hover:text-white"
                  type="button"
                  onClick={() => setGoal(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <Button
            className="h-12 w-full rounded-full bg-amber-300 text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-950 hover:bg-amber-200"
            disabled={isSubmitting}
            size="lg"
            type="submit"
          >
            {isSubmitting ? 'Submitting...' : 'Save request'}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </form>
  );
}
