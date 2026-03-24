import { AtSign, Check, Github, Linkedin, Plus, Sparkles } from 'lucide-react';
import { makeBlockie } from '../../lib/makeBlockie.ts';
import type { ProfileMatch } from '../../services/profile.service.ts';
import { ProfileDetailDialog } from './ProfileDetailDialog.tsx';

type LandingMatchCardProps = {
	match: ProfileMatch;
	isSaved?: boolean;
	isSaving?: boolean;
	onSave?: () => void;
};

const AVATAR_SIZE = 96;
const AVATAR_BORDER = 4;
const RING_SIZE = AVATAR_SIZE + 16;
const SVG_SIZE = 112;
const SVG_CENTER = SVG_SIZE / 2;
const RING_RADIUS = 48;
const RING_STROKE = 4;

function getFallbackSeed(match: ProfileMatch) {
	return (
		match.walletAddress ??
		match.farcasterHandle ??
		match.githubHandle ??
		match.id
	);
}

function getAvatarSource(match: ProfileMatch) {
	if (match.avatarUrl) {
		return match.avatarUrl;
	}

	return makeBlockie(getFallbackSeed(match), 8, 12);
}

function getCoverSource(match: ProfileMatch) {
	return makeBlockie(getFallbackSeed(match), 8, 20);
}

function getRingProgress(score: number) {
	return Math.max((Math.min(Math.max(score, 0), 100) / 100) * 72, 12);
}

function shortenAddress(address: string) {
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function LandingMatchCard({
	match,
	isSaved = false,
	isSaving = false,
	onSave,
}: LandingMatchCardProps) {
	const socials = [
		match.farcasterUrl
			? {
					key: 'farcaster',
					label: `fc/${match.farcasterHandle ?? 'profile'}`,
					href: match.farcasterUrl,
					icon: Sparkles,
				}
			: null,
		match.xUrl
			? {
					key: 'x',
					label: `@${match.xHandle ?? 'x'}`,
					href: match.xUrl,
					icon: AtSign,
				}
			: null,
		match.githubUrl
			? {
					key: 'github',
					label: match.githubHandle ?? 'github',
					href: match.githubUrl,
					icon: Github,
				}
			: null,
		match.linkedinUrl
			? {
					key: 'linkedin',
					label: match.linkedinHandle ?? 'linkedin',
					href: match.linkedinUrl,
					icon: Linkedin,
				}
			: null,
	].filter(Boolean) as Array<{
		key: string;
		label: string;
		href: string;
		icon: typeof Sparkles;
	}>;

	return (
		<article className="overflow-hidden rounded-[28px] border border-black/6 bg-white p-3 shadow-[0_12px_32px_rgba(18,18,18,0.06)]">
			<div className="rounded-[22px] bg-neutral-50/70 p-4">
				<div
					className="relative z-0 h-28 overflow-hidden rounded-[20px]"
					style={{
						backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.12)), url(${getCoverSource(
							match
						)})`,
						backgroundPosition: 'center',
						backgroundSize: 'cover',
					}}
				>
					<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.38))]" />
					<button
						className="absolute right-3 top-3 inline-flex size-11 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_10px_22px_rgba(18,18,18,0.12)] transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
						disabled={isSaved || isSaving}
						onClick={onSave}
						type="button"
					>
						{isSaved ? (
							<Check className="size-5" />
						) : isSaving ? (
							<span className="text-[10px] font-semibold">...</span>
						) : (
							<Plus className="size-5" />
						)}
					</button>
				</div>

				<div className="relative z-10 -mt-10 flex justify-center">
					<div
						className="relative flex items-center justify-center"
						style={{ width: `${RING_SIZE}px`, height: `${RING_SIZE}px` }}
					>
						<svg
							aria-hidden="true"
							className="absolute inset-0"
							style={{ width: `${SVG_SIZE}px`, height: `${SVG_SIZE}px` }}
							viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
						>
							<defs>
								<linearGradient
									id={`profile-ring-${match.id}`}
									x1="14%"
									x2="86%"
									y1="78%"
									y2="18%"
								>
									<stop offset="0%" stopColor="#8b5cf6" />
									<stop offset="48%" stopColor="#3b82f6" />
									<stop offset="100%" stopColor="#22c55e" />
								</linearGradient>
							</defs>
							<circle
								cx={SVG_CENTER}
								cy={SVG_CENTER}
								fill="none"
								pathLength="100"
								r={RING_RADIUS}
								stroke="rgba(17,17,17,0.10)"
								strokeDasharray="72 28"
								strokeLinecap="round"
								strokeWidth={RING_STROKE}
								transform={`rotate(150 ${SVG_CENTER} ${SVG_CENTER})`}
							/>
							<circle
								cx={SVG_CENTER}
								cy={SVG_CENTER}
								fill="none"
								pathLength="100"
								r={RING_RADIUS}
								stroke={`url(#profile-ring-${match.id})`}
								strokeDasharray={`${getRingProgress(match.score)} 100`}
								strokeLinecap="round"
								strokeWidth={RING_STROKE}
								transform={`rotate(150 ${SVG_CENTER} ${SVG_CENTER})`}
							/>
						</svg>
						<div
							className="flex items-center justify-center overflow-hidden rounded-full bg-white"
							style={{
								width: `${AVATAR_SIZE}px`,
								height: `${AVATAR_SIZE}px`,
								border: `${AVATAR_BORDER}px solid white`,
							}}
						>
							<img
								alt={match.name}
								className="size-full object-cover"
								referrerPolicy="no-referrer"
								src={getAvatarSource(match)}
							/>
						</div>
					</div>
				</div>

				<div className="pt-4 text-center">
					<h3 className="line-clamp-2 font-manrope text-[1.35rem] font-semibold tracking-[-0.04em] text-neutral-950">
						{match.name}
					</h3>
					<p className="mx-auto mt-2 max-w-[30ch] line-clamp-2 text-sm leading-6 text-neutral-500">
						{match.shortDescription ?? match.reason}
					</p>
					{match.walletAddress ? (
						<p className="mt-3 text-xs font-medium text-neutral-400">
							{match.ensName ?? shortenAddress(match.walletAddress)}
						</p>
					) : null}
				</div>

				<div className="mt-4 flex flex-wrap items-center justify-center gap-2">
					{socials.map(social => {
						const Icon = social.icon;

						return (
							<a
								className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition hover:-translate-y-0.5 hover:bg-neutral-50"
								href={social.href}
								key={social.key}
								rel="noreferrer"
								target="_blank"
								title={social.label}
							>
								<Icon className="size-[18px]" />
								<span>{social.label}</span>
							</a>
						);
					})}
				</div>

				<div className="mt-4">
					<ProfileDetailDialog
						isSaved={isSaved}
						isSaving={isSaving}
						match={match}
						onSave={onSave}
						triggerClassName="inline-flex w-full items-center justify-center rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
					/>
				</div>
			</div>
		</article>
	);
}
