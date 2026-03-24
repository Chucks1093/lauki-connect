import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, ChevronDown, Home, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signInWithBase } from '@/lib/baseAuth';
import { authService } from '@/services/auth.service';
import { shortenAddress } from '@/lib/web3/format';
import { WalletAvatar } from '@/components/shared/WalletAvatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ConnectButton() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: authSession } = useQuery({
    queryKey: ['auth-session'],
    queryFn: () => authService.getSession(),
  });
  const signInMutation = useMutation({
    mutationFn: signInWithBase,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth-session'] });
    },
  });
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['auth-session'] });
      navigate('/');
    },
  });

  const isAuthenticated = Boolean(authSession?.authenticated && authSession.address);

  const handleSignIn = async () => {
    try {
      await signInMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to sign in with Base:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  if (!isAuthenticated || !authSession?.address) {
    return (
      <button
        className="inline-flex h-10 items-center justify-center rounded-2xl bg-neutral-950 px-5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={signInMutation.isPending}
        onClick={handleSignIn}
        type="button"
      >
        {signInMutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="inline-flex items-center gap-3 rounded-full border border-black/8 bg-white px-3 py-2 text-sm text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          type="button"
        >
          <WalletAvatar
            address={authSession.address}
            className="size-8 rounded-full border border-black/8 object-cover"
          />
          <span className="font-medium">{shortenAddress(authSession.address)}</span>
          <ChevronDown className="size-4 text-neutral-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border border-black/8 bg-white p-2 shadow-[0_18px_50px_rgba(18,18,18,0.08)]"
      >
        <DropdownMenuLabel className="px-3 py-2 font-manrope text-xs uppercase tracking-[0.16em] text-neutral-500">
          Connected
        </DropdownMenuLabel>
        <div className="px-3 pb-2 text-sm font-medium text-neutral-900">
          {shortenAddress(authSession.address)}
        </div>
        <DropdownMenuSeparator className="bg-black/6" />
        <DropdownMenuItem
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm text-neutral-700 focus:bg-[#fff7f2] focus:text-neutral-900"
          onSelect={() => navigate('/')}
        >
          <Home className="size-4 text-[#ff5c16]" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm text-neutral-700 focus:bg-[#fff7f2] focus:text-neutral-900"
          onSelect={() => navigate('/saved')}
        >
          <Bookmark className="size-4 text-[#ff5c16]" />
          Saved matches
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer rounded-xl px-3 py-2.5 text-sm text-neutral-700 focus:bg-[#fff7f2] focus:text-neutral-900"
          disabled={logoutMutation.isPending}
          onSelect={handleSignOut}
        >
          <LogOut className="size-4 text-neutral-500" />
          {logoutMutation.isPending ? 'Logging out...' : 'Log out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
