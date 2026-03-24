import { useEffect, useState } from 'react';
import { ArrowRight, Clock3, Database, FolderSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';
import {
  connectRequestService,
  type ConnectRequest,
} from '../services/connect-request.service.ts';

export function DashboardPage() {
  const [requests, setRequests] = useState<ConnectRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    connectRequestService
      .getConnectRequests()
      .then((result) => {
        if (isMounted) {
          setRequests(result);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to load saved requests.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-sm sm:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-200">
            Saved requests
          </p>
          <h2 className="mt-3 font-grotesque text-4xl font-semibold tracking-tight text-white">
            Dashboard
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
            This is the live slice. Every card here should come from the database, not from a mock
            client store.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          {[
            { label: 'Requests', value: requests.length, icon: FolderSearch },
            { label: 'Persistence', value: 'DB-backed', icon: Database },
            { label: 'Next slice', value: 'Match results', icon: Clock3 },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm"
            >
              <item.icon className="size-5 text-amber-200" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                {item.label}
              </p>
              <p className="mt-2 font-grotesque text-2xl font-semibold text-white">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-400/20 bg-red-400/8 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {requests.length === 0 ? (
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm">
          <p className="font-grotesque text-2xl font-semibold text-white">No saved requests yet</p>
          <p className="mt-3 text-sm text-slate-400">
            Create the first real request and use this page to confirm the Section 3 flow is
            working.
          </p>
          <Button
            asChild
            className="mt-6 h-11 rounded-full bg-amber-300 px-5 text-[13px] font-semibold uppercase tracking-[0.18em] text-slate-950 hover:bg-amber-200"
          >
            <Link to="/requests/new">Create request</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {requests.map((request) => (
            <article
              key={request.id}
              className="group rounded-[30px] border border-white/10 bg-slate-950/55 p-6 backdrop-blur-sm transition hover:border-amber-300/20 hover:bg-slate-950/70"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Connect request
                  </p>
                  <h3 className="mt-3 font-grotesque text-2xl font-semibold leading-tight text-white">
                    {request.goal}
                  </h3>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  {request.id.slice(0, 8)}
                </span>
              </div>
              <p className="mt-5 text-sm text-slate-400">
                {request.requester ? `Requested by ${request.requester}` : 'No requester name'}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {new Date(request.createdAt).toLocaleString()}
              </p>
              <Link
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-200 transition group-hover:text-amber-100"
                to={`/requests/${request.id}/results`}
              >
                Open next slice placeholder
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
