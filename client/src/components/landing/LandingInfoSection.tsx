import { Globe } from 'lucide-react';

const momentumItems = [
  'Warm introductions to investors, collaborators, and operators.',
  'Faster routing for hiring, partnerships, and opportunity matching.',
  'Clearer context before outreach starts.',
];

const exampleRequests = [
  'I need a founder building in AI for a partnership conversation.',
  'I want an intro to investors interested in creator tools.',
  'I need a backend engineer for a startup operating in fintech.',
];

export function LandingInfoSection() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-[28px] border border-black/6 bg-white/80 p-6 shadow-[0_10px_40px_rgba(20,20,20,0.04)]">
        <h2 className="font-manrope text-2xl font-semibold tracking-[-0.03em] text-neutral-900">
          Built for business relationships that need momentum.
        </h2>
        <div className="mt-6 space-y-3">
          {momentumItems.map((item) => (
            <div
              className="rounded-[20px] border border-black/6 bg-[#fcfbf8] px-4 py-3 text-sm leading-6 text-neutral-700"
              key={item}
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
          {exampleRequests.map((example) => (
            <div
              className="rounded-[20px] border border-black/6 bg-[#fcfbf8] px-4 py-3 text-sm leading-6 text-neutral-700"
              key={example}
            >
              {example}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}
