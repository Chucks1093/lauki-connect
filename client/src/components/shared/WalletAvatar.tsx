import { makeBlockie } from '@/lib/makeBlockie';

type WalletAvatarProps = {
  address: string;
  className?: string;
};

export function WalletAvatar({ address, className }: WalletAvatarProps) {
  return (
    <img
      alt="Wallet avatar"
      className={className}
      src={makeBlockie(address)}
    />
  );
}
