import {
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  assertIsTransactionMessageWithBlockhashLifetime,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { getCreateAccountInstruction } from "@solana-program/system";

//import your wallet
import wallet from "../../devnet-wallet.json";

const rpc = createSolanaRpc("https://api.devnet.solana.com");

const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);

(async () => {
  try {
    // Create a signer.
    const signer = await createKeyPairSignerFromBytes(
      new Uint8Array(wallet),
    );

    // Generate the mint signer.
    const mint = await generateKeyPairSigner();

    // Mint account space.
    const space = BigInt(getMintSize());

    // Rent.
    const rent = await rpc
      .getMinimumBalanceForRentExemption(space)
      .send();

    // Get the latest blockhash.
    const { value: latestBlockhash } =
      await rpc.getLatestBlockhash().send();

    // Create send and confirm function.
    const sendAndConfirm = sendAndConfirmTransactionFactory({
      rpc,
      rpcSubscriptions,
    });

    // Transaction message.
    const msg = createTransactionMessage({ version: 0 });

    // Fee payer.
    const msgWithPayer = setTransactionMessageFeePayerSigner(
      signer,
      msg,
    );

    // Transaction lifetime.
    const msgWithLifetime =
      setTransactionMessageLifetimeUsingBlockhash(
        latestBlockhash,
        msgWithPayer,
      );

    // Add instructions to the transaction.
    const txMessage = appendTransactionMessageInstructions(
      [
        getCreateAccountInstruction({
          payer: signer,
          newAccount: mint,
          lamports: rent,
          space,
          programAddress: TOKEN_PROGRAM_ADDRESS,
        }),

        getInitializeMintInstruction({
          mint: mint.address,
          decimals: 6,
          mintAuthority: signer.address,
        }),
      ],
      msgWithLifetime,
    );

    // Sign the transaction.
    const signedTx =
      await signTransactionMessageWithSigners(txMessage);

    assertIsTransactionWithBlockhashLifetime(signedTx);

    // Get transaction signature.
    const signature =
      getSignatureFromTransaction(signedTx);

    // Send and confirm the transaction.
    await sendAndConfirm(signedTx, {
      commitment: "confirmed",
    });

    console.log(
      `mint address: ${mint.address}. Transaction Signature: ${signature}`,
    );

  } catch (error) {
    console.log(error);
  }
})();
