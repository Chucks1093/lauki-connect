import { Link } from 'react-router-dom';
import { ConnectButton } from '@/components/shared/ConnectButton';

export function AppHeader() {
	return (
		<header className="fixed left-1/2 top-4 z-20 w-full  max-w-7xl -translate-x-1/2 px-4   backdrop-blur-xl">
			<div className="flex items-center justify-between gap-4 mx-3 bg-white/78 px-5 py-3.5   sm:px-6 border border-black/6 rounded-full">
				<Link className="flex items-center gap-3" to="/">
					<img
						alt="Lauki Connect logo"
						className="size-5"
						src="/icons/logo.svg"
					/>
					<div className="flex items-center gap-3">
						<p className="font-manrope text-xl font-semibold tracking-tight text-neutral-900">
							Lauki Connect
						</p>
					</div>
				</Link>

				<ConnectButton />
			</div>
		</header>
	);
}
