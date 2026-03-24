import { Outlet } from 'react-router-dom';
import { AppHeader } from '@/components/shared/AppHeader';

export function AppShell() {
	return (
		<div className="relative min-h-screen overflow-hidden">
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-x-0 top-0 h-px bg-black/8" />
				<div className="absolute inset-y-0 left-0 w-px bg-black/6" />
				<div className="absolute inset-y-0 right-0 w-px bg-black/6" />
				<div className="absolute left-[12%] top-28 size-4 rounded-full border border-[#ff5c16]/18 bg-[#ff5c16]/6" />
				<div className="absolute right-[14%] top-40 size-4 rounded-full border border-[#ff5c16]/18 bg-[#ff5c16]/6" />
			</div>

			<div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 pb-12 pt-4 sm:px-6 lg:px-8">
				<AppHeader />

				<main className="flex-1 pt-24">
					<Outlet />
				</main>
			</div>
		</div>
	);
}
