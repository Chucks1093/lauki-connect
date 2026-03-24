import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestForm } from '../components/requests/RequestForm.tsx';
import { connectRequestService } from '../services/connect-request.service.ts';

export function NewRequestPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: { goal: string; requester: string }) {
    setError(null);

    try {
      const result = await connectRequestService.createConnectRequest(values);
      setMessage(`Saved request ${result.id}. Redirecting to dashboard...`);
      navigate('/dashboard');
    } catch {
      setMessage(null);
      setError('Failed to create request.');
    }
  }

  return (
    <section className="grid gap-6">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200">
            Section 3
          </p>
          <h2 className="mt-3 font-grotesque text-4xl font-semibold tracking-tight text-white">
            Save the request before anything else.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            No fake matches. No pretend ranking. This screen should only capture the user intent,
            send it to the backend, and persist it cleanly in Postgres.
          </p>
        </div>

        <div className="rounded-[32px] border border-cyan-300/12 bg-cyan-400/[0.06] p-6 backdrop-blur-sm sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-100/80">
            Acceptance check
          </p>
          <div className="mt-5 space-y-3">
            {[
              'Submit a request from the UI',
              'Backend writes the request to Postgres',
              'Dashboard lists the saved request',
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/8 bg-slate-950/40 px-4 py-3 text-sm text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <RequestForm onSubmit={handleSubmit} />

      {message ? (
        <p className="rounded-2xl border border-emerald-400/20 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-200">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}
    </section>
  );
}
