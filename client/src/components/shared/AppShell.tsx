import { Sparkles } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { useAccount, useConnect } from 'wagmi';
import { shortenAddress } from '../../lib/web3/format.ts';

export function AppShell() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const primaryConnector = connectors[0];

  const handleSignIn = () => {
    if (!primaryConnector) {
      return;
    }

    connect({ connector: primaryConnector });
  };

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
        <header className="sticky top-0 z-20 mb-10 border border-black/6 bg-white/78 px-5 py-3.5 backdrop-blur-xl sm:rounded-[24px] sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="size-5 text-[#ff5c16]" />
              <div className="flex items-center gap-3">
                <p className="font-manrope text-xl font-semibold tracking-tight text-neutral-900">
                  Lauki Connect
                </p>
              </div>
            </div>

            {isConnected && address ? (
              <button
                className="inline-flex items-center gap-3 rounded-full border border-black/8 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm"
                type="button"
              >
                <span className="inline-flex size-8 items-center justify-center rounded-full bg-neutral-950 text-xs font-semibold text-white">
                  {address.slice(2, 4).toUpperCase()}
                </span>
                <span className="font-medium">{shortenAddress(address)}</span>
              </button>
            ) : (
              <button
                className="inline-flex h-10 items-center justify-center rounded-2xl bg-neutral-950 px-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={!primaryConnector || isPending}
                onClick={handleSignIn}
                type="button"
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </button>
            )}
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
