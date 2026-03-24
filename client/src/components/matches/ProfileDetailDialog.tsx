import {
  AtSign,
  ExternalLink,
  Github,
  Linkedin,
  Sparkles,
  Wallet,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog.tsx';
import type { ProfileMatch } from '../../services/profile.service.ts';

type ProfileDetailDialogProps = {
  match: ProfileMatch;
  isSaved?: boolean;
  isSaving?: boolean;
  onSave?: () => void;
  triggerClassName?: string;
};

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ProfileDetailDialog({
  match,
  isSaved = false,
  isSaving = false,
  onSave,
  triggerClassName = 'inline-flex items-center justify-center rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50',
}: ProfileDetailDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={triggerClassName} type="button">
          View more
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-[28px] border-black/8 p-0" showCloseButton>
        <div className="overflow-hidden rounded-[28px] bg-white">
          <div className="border-b border-black/6 px-6 py-5">
            <DialogHeader className="text-left">
              <DialogTitle className="font-manrope text-2xl font-semibold text-neutral-900">
                {match.name}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm leading-6 text-neutral-600">
                {match.shortDescription ?? match.reason}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <section className="rounded-[24px] border border-black/6 bg-neutral-50 px-4 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Summary
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-700">{match.contributionSummary}</p>
              </section>

              <section className="rounded-[24px] border border-black/6 bg-neutral-50 px-4 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Why this match
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-700">{match.reason}</p>
              </section>

              {match.notableContracts.length > 0 ? (
                <section className="rounded-[24px] border border-black/6 bg-neutral-50 px-4 py-4">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Web3 signals
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {match.notableContracts.map((signal) => (
                      <span
                        className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-medium text-neutral-700"
                        key={signal}
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="space-y-5">
              <section className="rounded-[24px] border border-black/6 bg-neutral-50 px-4 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Profile data
                </h3>
                <div className="mt-3 grid gap-3 text-sm text-neutral-700">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-500">Role</span>
                    <span className="font-medium">{match.role}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-neutral-500">Company</span>
                    <span className="font-medium">{match.company}</span>
                  </div>
                  {match.walletAddress ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-neutral-500">Wallet</span>
                      <span className="font-medium">
                        {match.ensName ?? shortenAddress(match.walletAddress)}
                      </span>
                    </div>
                  ) : null}
                  {typeof match.baseTxCount === 'number' ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-neutral-500">Base txs</span>
                      <span className="font-medium">{match.baseTxCount}</span>
                    </div>
                  ) : null}
                  {match.onchainActivityGrade ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-neutral-500">Activity</span>
                      <span className="font-medium capitalize">{match.onchainActivityGrade}</span>
                    </div>
                  ) : null}
                  {typeof match.talentScore === 'number' ? (
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-neutral-500">Talent score</span>
                      <span className="font-medium">{Math.round(match.talentScore)}</span>
                    </div>
                  ) : null}
                </div>
              </section>

              <section className="rounded-[24px] border border-black/6 bg-neutral-50 px-4 py-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Socials
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {match.farcasterUrl && match.farcasterHandle ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-medium text-neutral-700"
                      href={match.farcasterUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      fc/{match.farcasterHandle}
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                  {match.xUrl && match.xHandle ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-medium text-neutral-700"
                      href={match.xUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <AtSign className="size-3.5" />@{match.xHandle}
                    </a>
                  ) : null}
                  {match.githubUrl && match.githubHandle ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-medium text-neutral-700"
                      href={match.githubUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Github className="size-3.5" />
                      {match.githubHandle}
                    </a>
                  ) : null}
                  {match.linkedinUrl ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-medium text-neutral-700"
                      href={match.linkedinUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Linkedin className="size-3.5" />
                      {match.linkedinHandle ?? 'LinkedIn'}
                    </a>
                  ) : null}
                  {match.talentProtocolUrl ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-medium text-neutral-700"
                      href={match.talentProtocolUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Sparkles className="size-3.5" />
                      Talent
                    </a>
                  ) : null}
                  {match.walletAddress ? (
                    <a
                      className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-white px-3 py-2 text-xs font-medium text-neutral-700"
                      href={`https://basescan.org/address/${match.walletAddress}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <Wallet className="size-3.5" />
                      Basescan
                    </a>
                  ) : null}
                </div>
              </section>
            </div>
          </div>

          <DialogFooter className="border-t border-black/6 px-6 py-5" showCloseButton>
            {onSave ? (
              <button
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSaved || isSaving}
                onClick={onSave}
                type="button"
              >
                {isSaved ? 'Saved' : isSaving ? 'Saving...' : 'Save profile'}
              </button>
            ) : null}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
