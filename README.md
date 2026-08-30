# Week 1 Assignment: SPL Token & MPL Core NFT

## Completed Tasks

### 1. SPL Token

- Created an SPL token
- Added token metadata
- Minted tokens
- Transferred tokens

**Mint address:**
`8u8jzgqN9qmXnkJ3Ggma7yNaUmqRmDfYATaeL4Auf3aJ`

**Transactions:**

- [Mint](https://explorer.solana.com/tx/43A3wgzRY43vzZEs7tR643DThf12wtpYy83AuN8UdWVL7DaNK6J4ggt8ogwFGpaioK4JPSGuRrmUqrSpY1rTvrEg?cluster=devnet)
- [Metadata](https://explorer.solana.com/tx/3usTXRYUfBy5jMKDBZpfaWvfKqi55e1RuGSZ712JS6M6QNPtgDPdmToxGjFkqwsA2DJ5ca4onWpJxGbo29s1DSq8?cluster=devnet)
- [Transfer](https://explorer.solana.com/tx/4W8xBqscdfvd17fNh3cz5hba94AeHttnmJGQzo3q4ndq6Yo4KAXKYksdAPJhPeYc6MF9gGZDFtC1mjCPzBfUQu8N?cluster=devnet)

### 2. MPL Core NFT

- Uploaded NFT image and metadata to Irys
- Minted an NFT using Metaplex Core
- Updated the NFT's name and metadata as the update authority

**Asset:**
`BSagrBkG7gB3ar2AVjg9pnfcHjwm8oMNqxxEAYtbQqzX`

**Original name:**
`Bhavesh NFT`

**Updated name:**
`Bhavesh updated NFT`

**Transactions:**

- [Mint](https://explorer.solana.com/tx/re7RnxeH64DCQRrpjK2Dp9jAeo4FXwfZbPYJ6NHo3u74e2kZCtvMQWUfS4RwmfdewHGZRLzvrMw9uJbX5499Bv4?cluster=devnet)
- [Update](https://explorer.solana.com/tx/3Nub9eZR29oeYgstGY2nhfxTBG8vN2Bi9dQiRrNNEL7x9SARiHsgaW9x1HjeUPyy1N4NsH6HU2z5w5cTEsxvphiM?cluster=devnet)
- [View Asset](https://explorer.solana.com/address/BSagrBkG7gB3ar2AVjg9pnfcHjwm8oMNqxxEAYtbQqzX?cluster=devnet)
- [Original metadata](https://gateway.irys.xyz/12p9hwgXKXHG1LfqqKCS1gZTtYHV8G2tTtd6zbAsWRo)
- [Updated metadata uri](https://gateway.irys.xyz/CrvoLy1T15gDsmReJ6zzw6UTcujvzTfKiW4q1mmkYpB1)

## Run

Install dependencies:

```bash
npm install
```

## SPL scripts

```bash
npm run spl:init
npm run spl:metadata
npm run spl:mint
npm run spl:transfer
```

## NFT scripts

```bash
npm run nft:image
npm run nft:metadata
npm run nft:mint
npm run nft:update
```

A Devnet wallet must be placed at `devnet-wallet.json`. The wallet file is excluded from Git.

## Verification

All required tasks were successfully executed on Solana Devnet.

The Solana Explorer links above provide on-chain verification of the completed work.
