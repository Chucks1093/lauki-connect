import type { FormEvent } from 'react';
import { ArrowRight, Globe } from 'lucide-react';

type QuickPrompt = {
  label: string;
  prompt: string;
};

type LandingSearchBarProps = {
  goal: string;
  isSubmitting: boolean;
  quickPrompts: QuickPrompt[];
  onGoalChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function LandingSearchBar({
  goal,
  isSubmitting,
  quickPrompts,
  onGoalChange,
  onSubmit,
}: LandingSearchBarProps) {
  return (
    <form
      className="relative mt-10 w-full max-w-[48rem] rounded-[28px] border border-black/8 bg-white p-3 shadow-[0_20px_60px_rgba(18,18,18,0.08)] sm:p-4"
      onSubmit={onSubmit}
    >
      <div className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-3">
        <div className="relative flex items-center rounded-[20px] border border-black/8 bg-white pl-4 pr-20 shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
          <Globe className="size-4 text-neutral-400" />
          <input
            className="h-14 w-full bg-transparent px-3 font-manrope text-[15px] text-neutral-700 outline-none placeholder:text-neutral-400"
            onChange={(event) => onGoalChange(event.target.value)}
            placeholder="I need an intro to investors interested in creator tools."
            value={goal}
          />
          <button
            className="absolute right-2 inline-flex size-11 items-center justify-center rounded-[16px] bg-[#ff5c16] text-white shadow-[0_12px_30px_rgba(255,92,22,0.22)] transition hover:bg-[#e75211] disabled:cursor-wait disabled:opacity-70"
            disabled={isSubmitting}
            type="submit"
          >
            <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 rounded-[18px] border border-black/6 bg-[#f3f1ec] p-2">
          {quickPrompts.map((item, index) => (
            <button
              key={item.label}
              className={
                index === 0
                  ? 'rounded-[14px] border border-black/8 bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-sm transition hover:bg-neutral-50'
                  : 'rounded-[14px] border border-transparent px-4 py-2 text-sm font-medium text-neutral-500 transition hover:border-black/8 hover:bg-white/80 hover:text-neutral-900'
              }
              onClick={() => onGoalChange(item.prompt)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
