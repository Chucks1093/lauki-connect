import { useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { authService } from '../services/auth.service.ts';
import { LandingFeatureGrid } from '../components/landing/LandingFeatureGrid.tsx';
import { LandingHero } from '../components/landing/LandingHero.tsx';
import { LandingInfoSection } from '../components/landing/LandingInfoSection.tsx';
import { LandingMatchesSection } from '../components/landing/LandingMatchesSection.tsx';
import { LandingSearchBar } from '../components/landing/LandingSearchBar.tsx';
import { profileService, type ProfileMatch } from '../services/profile.service.ts';

export function LandingPage() {
	const { data: authSession } = useQuery({
		queryKey: ['auth-session'],
		queryFn: () => authService.getSession(),
	});
	const isAuthenticated = authSession?.authenticated ?? false;
	const [goal, setGoal] = useState(
		'I need an intro to investors interested in creator tools.'
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
				'I need an intro to strong builders working on Base-native products.',
		},
		{
			label: 'Investor',
			prompt:
				'I want an intro to investors active in early-stage crypto and creator tools.',
		},
		{
			label: 'Operator',
			prompt:
				'I need an operator with growth and ecosystem experience for a Base project.',
		},
		{
			label: 'Partner',
			prompt:
				'I need a strategic partner for distribution and ecosystem collaboration.',
		},
	];

	async function handleQuickRequestSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!isAuthenticated) {
			setError('Sign in first to search profiles.');
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
						description="Find the right collaborator, investor, operator, or opportunity. Lauki Connect helps teams discover relevant matches and move faster."
						title="better introductions"
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
