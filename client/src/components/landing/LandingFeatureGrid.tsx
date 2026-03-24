import { Handshake, SearchCheck, Sparkles } from 'lucide-react';

const features = [
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
    body: 'Save the strongest profiles and reach out directly.',
    icon: Sparkles,
  },
];

export function LandingFeatureGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {features.map((item) => (
        <article
          className="rounded-[28px] border border-black/6 bg-white/80 p-5 shadow-[0_10px_40px_rgba(20,20,20,0.04)]"
          key={item.title}
        >
          <span className="inline-flex size-9 items-center justify-center rounded-2xl border border-black/6 bg-[#fff7f2] text-[#ff5c16]">
            <item.icon className="size-4" />
          </span>
          <h3 className="mt-4 font-manrope text-lg font-semibold text-neutral-900">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-neutral-600">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
