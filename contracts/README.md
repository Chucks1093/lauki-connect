# Lauki Connect Contracts

Minimal Base contracts for Lauki Connect.

Current contract:
- `LaukiConnectProfileRegistry`

Purpose:
- let a wallet register an app-specific public profile
- store minimal profile state on Base
- keep full search, ranking, and saved matches offchain

## Local build

```bash
cd /Users/sebastain/Documents/programs/projects/lauki-connect/contracts
forge build
forge test
```

## Deploy

Set:

```bash
export RPC_URL="https://mainnet.base.org"
export DEPLOYER_ADDRESS="0x..."
export PRIVATE_KEY="0x..."
```

Then run:

```bash
forge script script/Deploy.s.sol:Deploy \
  --rpc-url "$RPC_URL" \
  --broadcast
```

The deploy script prints the deployed contract address.

## Why this contract exists

Wallet connection already proves wallet ownership.

This contract adds app-specific profile registration:
- one wallet can register one Lauki Connect profile
- profile metadata is pointed to by `metadataURI`
- role and active status are onchain

Search still works offchain:
1. user searches in the app
2. backend searches stored profiles
3. ranking happens offchain
4. contract is used only to prove app-level profile ownership
