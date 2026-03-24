import { Star } from 'lucide-react';

type LandingHeroProps = {
	title: string;
	description: string;
};

export function LandingHero({ title, description }: LandingHeroProps) {
	return (
		<div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
			<div className="inline-flex items-center gap-2 rounded-[5rem] border border-black/8 bg-white px-2 py-1.5 text-[13px] font-medium text-neutral-800">
				<span className="inline-flex size-7 items-center justify-center rounded-full bg-[#ff5c16] text-white">
					<Star className="size-3.5 stroke-3" />
				</span>
				<span className="mr-3 font-manrope">Smart introductions</span>
			</div>

			<div className="mt-5 max-w-3xl">
				<h1 className="font-manrope text-4xl font-semibold leading-[0.98] tracking-[-0.045em] text-neutral-900 sm:text-5xl md:text-6xl">
					Turn business needs into
					<span className="block text-[#ff5c16]">{title}</span>
				</h1>
				<p className="mx-auto mt-4 max-w-lg font-manrope text-sm leading-6 text-neutral-600 sm:text-base">
					{description}
				</p>
			</div>
		</div>
	);
}
