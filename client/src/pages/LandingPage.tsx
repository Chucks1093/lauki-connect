import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service.ts';
import { LandingFeatureGrid } from '../components/landing/LandingFeatureGrid.tsx';
import { LandingHero } from '../components/landing/LandingHero.tsx';
import { LandingInfoSection } from '../components/landing/LandingInfoSection.tsx';
import { LandingMatchesSection } from '../components/landing/LandingMatchesSection.tsx';
import { LandingSearchBar } from '../components/landing/LandingSearchBar.tsx';
import { profileService, type ProfileMatch } from '../services/profile.service.ts';
import showToast from '../utils/toast.util.ts';

export function LandingPage() {
	const { data: authSession } = useQuery({
		queryKey: ['auth-session'],
		queryFn: () => authService.getSession(),
	});
	const isAuthenticated = authSession?.authenticated ?? false;
	const [goal, setGoal] = useState(
		'Find strong Base builders working on wallets, agents, or onchain apps.'
	);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [matches, setMatches] = useState<ProfileMatch[]>([]);
	const [savedProfileIds, setSavedProfileIds] = useState<string[]>([]);
	const [savingProfileId, setSavingProfileId] = useState<string | null>(null);

	const quickPrompts = [
		{
			label: 'Builder',
			prompt:
				'Find strong Base builders shipping consumer apps, wallets, or developer tools.',
		},
		{
			label: 'Investor',
			prompt:
				'Find Base investors backing early-stage consumer crypto, creator, or infrastructure products.',
		},
		{
			label: 'Operator',
			prompt:
				'Find operators with Base ecosystem, growth, and community experience.',
		},
		{
			label: 'Partner',
			prompt:
				'Find Base-native partners for distribution, ecosystem support, or integrations.',
		},
	];

	async function handleQuickRequestSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!isAuthenticated) {
			showToast.error('Sign in to see your results.');
			return;
		}

		const trimmedGoal = goal.trim();
		if (!trimmedGoal) {
			setError('Enter a request first.');
			return;
		}

		setIsSubmitting(true);
		setError(null);
		setMatches([]);

		try {
			const rankedMatches = await profileService.searchProfiles(trimmedGoal);
			setMatches(rankedMatches);
		} catch {
			setError('Failed to fetch matches.');
		} finally {
			setIsSubmitting(false);
		}
	}

	async function handleSaveProfile(profile: ProfileMatch) {
		if (!authSession?.authenticated) {
			setError('Sign in first to save profiles.');
			return;
		}

		setSavingProfileId(profile.id);
		setError(null);

		try {
			await profileService.saveProfile(profile);
			setSavedProfileIds((currentIds) =>
				currentIds.includes(profile.id) ? currentIds : [...currentIds, profile.id]
			);
		} catch {
			setError('Failed to save this profile.');
		} finally {
			setSavingProfileId(null);
		}
	}

	return (
		<section className="grid gap-8">
			<div className="relative overflow-hidden rounded-[36px] border border-black/6 bg-white/72 px-5 py-8 backdrop-blur-sm sm:px-8 sm:py-16">
				<div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
					<LandingHero
						description="Find the right collaborator, investor, operator, or partner. Lauki Connect helps teams discover relevant profiles and move faster."
						title="builder profiles"
					/>
					<LandingSearchBar
						goal={goal}
						isAuthenticated={isAuthenticated}
						isSubmitting={isSubmitting}
						onGoalChange={setGoal}
						onSubmit={handleQuickRequestSubmit}
						quickPrompts={quickPrompts}
					/>

					{error ? (
						<p className="mt-3 text-xs text-red-500">{error}</p>
					) : null}
				</div>
			</div>

			<LandingMatchesSection
				matches={matches}
				onSave={handleSaveProfile}
				savedProfileIds={savedProfileIds}
				savingProfileId={savingProfileId}
			/>

			<LandingFeatureGrid />

			<LandingInfoSection />
		</section>
	);
}
