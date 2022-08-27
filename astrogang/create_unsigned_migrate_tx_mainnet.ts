import {
  LCDClient,
  LegacyAminoMultisigPublicKey,
  MsgExecuteContract,
  SimplePublicKey,
  MsgUpdateContractAdmin,
  MsgMigrateContract,
} from "@terra-money/terra.js";
import { writeFileSync } from "fs";
import "dotenv/config.js";

// CONSTS

// "astral_assembly_address": "terra1sq9ppsvt4k378wwhvm2vyfg7kqrhtve8p0n3a6",
// "assembly_treasury_address": "terra16m3runusa9csfev7ymj62e8lnswu8um29k5zky",
const NEW_ADMIN = "terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq";

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

  if (CHAIN_ID != "phoenix-1") {
    console.log("Chain ID needs to be Phoenix-1");
    return;
  }

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
        // new MsgMigrateContract(
        //  multisigAddress,
        //  "terra1nyu6sk9rvtvsltm7tjjrp6rlavnm3e4sq03kltde6kesam260f8szar8ze",
        //  85,
        //  {}
        // ),
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3",
        //   { transfer : { recipient: "terra16m3runusa9csfev7ymj62e8lnswu8um29k5zky", amount: '488105586577864' } }
        // )
        new MsgUpdateContractAdmin(
          multisigAddress,
          NEW_ADMIN,
          "terra1alzkrc6hkvs8g5a064cukfxnv0jj4l3l8vhgfypfxvysk78v6dgqsymgmv"
        ),
        new MsgUpdateContractAdmin(
          multisigAddress,
          NEW_ADMIN,
          "terra1h6xr89an8gh63wvju7rfrkstmf8wpxlzr2xa4l72rg8u9jp4clusqkkudk"
        ),
        new MsgUpdateContractAdmin(
          multisigAddress,
          NEW_ADMIN,
          "terra1ynkgl2e7aphrc33pkx4tr4jc9vynddcesd750tg0cq0jrdudyy6sch4ka9"
        ),
        new MsgUpdateContractAdmin(
          multisigAddress,
          NEW_ADMIN,
          "terra1yahrrps6tv6nsk8a8mcjynsty5yutryg5ctr0sp7t7hxnflnuwys74yysn"
        ),
        new MsgUpdateContractAdmin(
          multisigAddress,
          NEW_ADMIN,
          "terra1qdv90q7rdg60tlpyeem93c88avp8lvnwa04sxr3yxsfcnccknnysft59tg"
        ),
        new MsgUpdateContractAdmin(
          multisigAddress,
          NEW_ADMIN,
          "terra108psz4xadgpytu76dfztaytkldvrh6zl35nwdy6n2cltvn0dkt8qu26rde"
        ),
        new MsgUpdateContractAdmin(
          multisigAddress,
          NEW_ADMIN,
          "terra1apzktjcuez96a2mhuuptnkphpevvn5m8rfjcwvnrpaaxmpv5mrasq2fgwk"
        ),
        new MsgUpdateContractAdmin(
          multisigAddress,
          NEW_ADMIN,
          "terra1zjfy562q4nw0fwhhp8hmck88td3trlj76wqhhkncal25qu4mck6sgpkau4"
        ),
      ],
      // memo : "Astroport -::- Transfer ASTRO to Treasury"
    }
  );

  // new MsgMigrateContract(
  //   multisigAddress,
  //   "terra16t7dpwwgx9n3lq6l6te3753lsjqwhxwpday9zx",
  //   2818,
  //   {},
  // )

  // "terra1dyuvfvjpuhqrmjly0xh3fhk207cyx8yrw2n736",
  // "terra1xf6dsqpqap3hczk9jd7938h5n8de8ap9ycxhvu",
  // "terra1r9vxaprx2j2djyrse60yppawpuncm7wcujjc9w"

  const unsignedTxFilename = `27_update_xyk_admin_unsigned.json`;

  writeFileSync(unsignedTxFilename, JSON.stringify(tx.toData()));

  console.log("27_update_xyk_admin_unsigned.JSON successfully created");

  // Run `broadcast_tx.ts` to aggregate at least K of N signatures and broadcast the signed tx to the network
})();
