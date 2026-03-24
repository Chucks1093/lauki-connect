import { useState, type FormEvent } from 'react';
import { ArrowRight, Globe, Handshake, SearchCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { connectRequestService } from '../services/connect-request.service.ts';

export function LandingPage() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState('I need an intro to investors interested in creator tools.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleQuickRequestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedGoal = goal.trim();
    if (!trimmedGoal) {
      setError('Enter a request first.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await connectRequestService.createConnectRequest({
        goal: trimmedGoal,
      });
      navigate('/dashboard');
    } catch {
      setError('Failed to save request.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="grid gap-8">
      <div className="relative overflow-hidden rounded-[36px] border border-black/6 bg-white/72 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-10">
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <div className="inline-flex min-w-[220px] items-center justify-between gap-3 rounded-full border border-black/8 bg-white px-4 py-1.5 text-[13px] font-medium text-neutral-800 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
            <span className="font-manrope">Smart introductions</span>
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-neutral-900 text-white">
              <Sparkles className="size-3.5" />
            </span>
          </div>

          <div className="mt-7 max-w-3xl">
            <h1 className="font-manrope text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-neutral-900 sm:text-5xl md:text-6xl">
              Turn business needs into
              <span className="block text-[#ff5c16]">better introductions</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg font-manrope text-sm leading-6 text-neutral-600 sm:text-base">
              Find the right collaborator, investor, operator, or opportunity.
              Lauki Connect helps teams discover relevant matches and move faster.
            </p>
          </div>

          <form
            className="relative mt-10 w-full max-w-[48rem] rounded-[28px] border border-black/8 bg-white p-3 shadow-[0_20px_60px_rgba(18,18,18,0.08)] sm:p-4"
            onSubmit={handleQuickRequestSubmit}
          >
            <div className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-3">
              <div className="relative flex items-center rounded-[20px] border border-black/8 bg-white pl-4 pr-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                <Globe className="size-4 text-neutral-400" />
                <input
                  className="h-14 w-full bg-transparent px-3 font-manrope text-[15px] text-neutral-700 outline-none placeholder:text-neutral-400"
                  placeholder="I need an intro to investors interested in creator tools."
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                />
                <button
                  className="absolute right-2 inline-flex size-11 items-center justify-center rounded-[16px] bg-[#ff5c16] text-white shadow-[0_12px_30px_rgba(255,92,22,0.22)] transition hover:bg-[#e75211] disabled:cursor-wait disabled:opacity-70"
                  disabled={isSubmitting}
                  type="submit"
                >
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </form>

          {error ? <p className="mt-3 text-xs text-red-500">{error}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: 'Describe the need',
            body: 'State the person, company, or opportunity you want.',
            icon: SearchCheck,
          },
          {
            title: 'Review the fit',
            body: 'See why the suggested introduction makes sense.',
            icon: Handshake,
          },
          {
            title: 'Move it forward',
            body: 'Use a stronger intro draft and track the outcome.',
            icon: Sparkles,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-[28px] border border-black/6 bg-white/80 p-5 shadow-[0_10px_40px_rgba(20,20,20,0.04)]"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-black/6 bg-[#fff7f2] text-[#ff5c16]">
              <item.icon className="size-4" />
            </span>
            <h3 className="mt-4 font-manrope text-lg font-semibold text-neutral-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[28px] border border-black/6 bg-white/80 p-6 shadow-[0_10px_40px_rgba(20,20,20,0.04)]">
          <h2 className="font-manrope text-2xl font-semibold tracking-[-0.03em] text-neutral-900">
            Built for business relationships that need momentum.
          </h2>
          <div className="mt-6 space-y-3">
            {[
              'Warm introductions to investors, collaborators, and operators.',
              'Faster routing for hiring, partnerships, and opportunity matching.',
              'Clearer context before outreach starts.',
            ].map((item) => (
              <div
                key={item}
                className="rounded-[20px] border border-black/6 bg-[#fcfbf8] px-4 py-3 text-sm leading-6 text-neutral-700"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[28px] border border-black/6 bg-white/80 p-6 shadow-[0_10px_40px_rgba(20,20,20,0.04)]">
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <Globe className="size-4" />
            Example requests
          </div>
          <div className="mt-5 space-y-3">
            {[
              'I need a founder building in AI for a partnership conversation.',
              'I want an intro to investors interested in creator tools.',
              'I need a backend engineer for a startup operating in fintech.',
            ].map((example) => (
              <div
                key={example}
                className="rounded-[20px] border border-black/6 bg-[#fcfbf8] px-4 py-3 text-sm leading-6 text-neutral-700"
              >
                {example}
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
