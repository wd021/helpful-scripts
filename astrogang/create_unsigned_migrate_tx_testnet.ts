import {
  LCDClient,
  LegacyAminoMultisigPublicKey,
  MsgExecuteContract,
  SimplePublicKey,
  MsgMigrateContract,
} from "@terra-money/terra.js";
import { writeFileSync } from "fs";
import "dotenv/config.js";

if (
  !(
    process.env.CHAIN_ID &&
    process.env.LCD_CLIENT_URL &&
    process.env.MULTISIG_PUBLIC_KEYS &&
    process.env.MULTISIG_THRESHOLD
  )
) {
  throw new Error("One or more required environment variables are missing");
}

// Terra network details:
const CHAIN_ID = process.env.CHAIN_ID;
const LCD_CLIENT_URL = process.env.LCD_CLIENT_URL;
// Multisig details:
const MULTISIG_PUBLIC_KEYS = process.env.MULTISIG_PUBLIC_KEYS.split(",")
  // terrad sorts keys of multisigs by comparing bytes of their address
  .sort((a, b) => {
    return Buffer.from(new SimplePublicKey(a).rawAddress()).compare(
      Buffer.from(new SimplePublicKey(b).rawAddress())
    );
  })
  .map((x) => new SimplePublicKey(x));
const MULTISIG_THRESHOLD = parseInt(process.env.MULTISIG_THRESHOLD);

// MAIN

(async () => {
  const terra = new LCDClient({
    URL: LCD_CLIENT_URL,
    chainID: CHAIN_ID,
  });

  // if (CHAIN_ID != "columbus-5") {
  //   console.log("Chain ID needs to be Columbus-5")
  //   return
  // }

  const multisigPubKey = new LegacyAminoMultisigPublicKey(
    MULTISIG_THRESHOLD,
    MULTISIG_PUBLIC_KEYS
  );

  // MultiSig address
  const multisigAddress = multisigPubKey.address();
  console.log("ASTRO Multisig :: ", multisigAddress);
  console.log("chainID:", CHAIN_ID);

  const accInfo = await terra.auth.accountInfo(multisigAddress);
  console.log("Sequence Number : ", accInfo.getSequenceNumber());
  console.log("Account Number : ", accInfo.getAccountNumber());

  // MIGRATE TRANSACTION
  const tx = await terra.tx.create(
    [
      {
        address: multisigAddress,
        sequenceNumber: accInfo.getSequenceNumber(),
        publicKey: accInfo.getPublicKey(),
      },
    ],
    {
      msgs: [
        new MsgMigrateContract(
          multisigAddress,
          "terra13wf295fj9u209nknz2cgqmmna7ry3d3j5kv7t4",
          42287,
          {}
        ),
      ],
    }
  );

  const unsignedTxFilename = `31_testnet_migrate_lockdrop_contract_unsigned.json`;

  writeFileSync(unsignedTxFilename, JSON.stringify(tx.toData()));

  console.log(
    "31_testnet_migrate_lockdrop_contract_unsigned.JSON successfully created"
  );

  // Run `broadcast_tx.ts` to aggregate at least K of N signatures and broadcast the signed tx to the network
})();
