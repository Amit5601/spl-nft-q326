import {
  address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import wallet from "../../devnet-wallet.json";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenInstructionAsync,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);

const token_decimals = 1_000_000n;

//paste your mint address got from spl_init.ts
const mint = address("8u8jzgqN9qmXnkJ3Ggma7yNaUmqRmDfYATaeL4Auf3aJ");

//paste the address of the recipient
const to = address("5xbatCf9qnb7YEg1jYbM7EQLzuUz7mhxim44t1927ggq");

(async () => {
  try {
    const signer = await createKeyPairSignerFromBytes(new Uint8Array(wallet));
    const sendAndConfirm = sendAndConfirmTransactionFactory({
      rpc,
      rpcSubscriptions,
    });

    const [fromAta] = await findAssociatedTokenPda({
      mint,
      owner: signer.address,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    console.log(`Your fromAta is : ${fromAta}`);

    const [toAta] = await findAssociatedTokenPda({
      mint,
      owner: to,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    console.log(`Your toAta is : ${toAta}`);

     const createAtaIx = await getCreateAssociatedTokenInstructionAsync({
  payer: signer,
  mint,
  owner: to,
  ata: toAta,
});

     const transferTx = getTransferCheckedInstruction({
  amount: token_decimals * 1_000_000n,
  mint,
  decimals: 6,
  authority: signer,
  source: fromAta,
  destination: toAta,
});

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const msg = createTransactionMessage({ version: 0 });

    const msgWithPayer = setTransactionMessageFeePayerSigner(signer, msg);

    const msgWithLiftime = setTransactionMessageLifetimeUsingBlockhash(
      latestBlockhash,
      msgWithPayer,
    );

     const txMessage = appendTransactionMessageInstructions(
       [createAtaIx, transferTx],
       msgWithLiftime,
     );

     const signedTx = await signTransactionMessageWithSigners(txMessage);

     assertIsTransactionWithBlockhashLifetime(signedTx);

     const signature = getSignatureFromTransaction(signedTx);

     await sendAndConfirm(signedTx, { commitment: "confirmed" });

     console.log(`mint txid: ${signature}`);
  } catch (error) {
    console.log(error);
  }
})();
