import {
  LCDClient,
  LegacyAminoMultisigPublicKey,
  MsgExecuteContract,
  SimplePublicKey,
} from "@terra-money/terra.js";
import { writeFileSync } from "fs";
import "dotenv/config.js";

// CONSTS
// const deployer_address = "terra17ms5h47n3vf40wt6cavpr4kje66p5t74r8f90u";

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

  const accInfo = await terra.auth.accountInfo(multisigAddress);
  console.log("Sequence Number : ", accInfo.getSequenceNumber());
  console.log("Account Number : ", accInfo.getAccountNumber());

  // GENERATOR - UPDATE TOKENS PER BLOCK
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
        // Vesting
        new MsgExecuteContract(
          multisigAddress,
          "terra1g73et67yraz33vtwtg8c7q39gq50z2q92dz822",
          {
            propose_new_owner: {
              owner: "terra109039nj38vnzyryqvcjctdh33r4qlq5dmrzqn0",
              expires_in: 99999999999,
            },
          }
        ),
        // Lockdrop
        new MsgExecuteContract(
          multisigAddress,
          "terra1dd9kewme9pwhurvlzuvvljq5ukecft9axyej42",
          {
            update_config: {
              new_config: {
                owner: "terra109039nj38vnzyryqvcjctdh33r4qlq5dmrzqn0",
              },
            },
          }
        ),
        // Auction
        new MsgExecuteContract(
          multisigAddress,
          "terra1mjqjcv7yl94h6y35ng7eqstakxjx9g57suscx7",
          {
            update_config: {
              new_config: {
                owner: "terra109039nj38vnzyryqvcjctdh33r4qlq5dmrzqn0",
              },
            },
          }
        ),
      ],
      // memo: "ASTROPORT -::- Generator -::- Update ASTRO tokens distributed per block"
    }
  );

  // STABLE PAIR - UPDATE AMP PARAMETER
  // const tx = await terra.tx.create(
  //   [
  //     {
  //       address: multisigAddress,
  //       sequenceNumber: accInfo.getSequenceNumber(),
  //       publicKey: accInfo.getPublicKey(),
  //     },
  //   ],
  //   {
  //     msgs: [
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1esle9h9cjeavul53dqqws047fpwdhj6tynj5u4",
  //         { update_config : { params: toEncodedBinary( {start_changing_amp: { next_amp: 10, next_amp_time:1641895800 } } ) } }

  //       )
  //     ],
  //   }
  // )

  // // ASTROPORT FACTORY -::- CREATE NEW POOL TYPE
  // const tx = await terra.tx.create(
  //   [
  //     {
  //       address: multisigAddress,
  //       sequenceNumber: accInfo.getSequenceNumber(),
  //       publicKey: accInfo.getPublicKey(),
  //     },
  //   ],
  //   {
  //     msgs: [
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra15jsahkaf9p0qu8ye873p0u5z6g07wdad0tdq43",
  //         { update_pair_config : { config:  { code_id: 28366, pair_type: { custom: "xyk_2bps"}, total_fee_bps: 30, maker_fee_bps:667, is_disabled:false  }  } }
  //       )
  //     ],
  //   }
  // )

  const unsignedTxFilename = `62_migrate_to_assembly_unsigned.json`;

  writeFileSync(unsignedTxFilename, JSON.stringify(tx.toData()));

  console.log("62_migrate_to_assembly_unsigned.JSON successfully created");

  // Run `broadcast_tx.ts` to aggregate at least K of N signatures and broadcast the signed tx to the network
})();

export function toEncodedBinary(object: any) {
  return Buffer.from(JSON.stringify(object)).toString("base64");
}
