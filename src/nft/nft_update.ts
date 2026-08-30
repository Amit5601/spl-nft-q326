import { base58 } from "@metaplex-foundation/umi/serializers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import wallet from "../../devnet-wallet.json";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import {
  fetchAsset,
  mplCore,
  update,
} from "@metaplex-foundation/mpl-core";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

umi.use(mplCore());

umi.use(
  irysUploader({
    address: "https://devnet.irys.xyz/",
  }),
);

(async () => {
  try {
    const assetAddress = publicKey(
      "BSagrBkG7gB3ar2AVjg9pnfcHjwm8oMNqxxEAYtbQqzX",
    );

    const asset = await fetchAsset(umi, assetAddress);

    console.log("Current NFT name:", asset.name);
    console.log("Current metadata URI:", asset.uri);

    const newMetadata = {
      name: "Bhavesh updated NFT",
      description: "My updated MPL Core NFT",
      image:
        "https://gateway.irys.xyz/DrCHEhREsNHe2vnv5KbjVSNriU5EgXChF3hDxKhSCPeS",
    };

    const newMetadataUri = await umi.uploader.uploadJson(newMetadata);

    console.log("New metadata URI:", newMetadataUri);

    const tx = await update(umi, {
      asset,
      name: "Bhavesh updated NFT",
      uri: newMetadataUri,
    }).sendAndConfirm(umi);

    console.log("NFT updated successfully!");
    const signature = base58.deserialize(tx.signature)[0];

    console.log("Transaction signature:", signature);
  } catch (error) {
    console.log("error", error);
  }
})();
