import { createBaseAccountSDK } from '@base-org/account';
import { authService } from '@/services/auth.service';
import { env } from '@/utils/env.utils';

function getBaseChainHex() {
  return `0x${env.VITE_BASE_CHAIN_ID.toString(16)}`;
}

export async function signInWithBase() {
  const nonce = (await authService.getNonce()).nonce;
  const provider = createBaseAccountSDK({
    appName: 'Lauki Connect',
  }).getProvider();
  const chainId = getBaseChainHex();

  await provider.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId }],
  });

  const connectResponse = (await provider.request({
    method: 'wallet_connect',
    params: [
      {
        version: '1',
        capabilities: {
          signInWithEthereum: {
            nonce,
            chainId,
          },
        },
      },
    ],
  })) as {
    accounts?: Array<{
      address: string;
      capabilities?: {
        signInWithEthereum?: {
          message: string;
          signature: string;
        };
      };
    }>;
    signInWithEthereum?: {
      message: string;
      signature: string;
    };
  };

  const account = connectResponse.accounts?.[0];
  const signInPayload =
    account?.capabilities?.signInWithEthereum ?? connectResponse.signInWithEthereum;

  if (!account?.address || !signInPayload?.message || !signInPayload.signature) {
    throw new Error('Missing sign-in payload from Base wallet');
  }

  return authService.verify({
    address: account.address,
    message: signInPayload.message,
    signature: signInPayload.signature,
  });
}
