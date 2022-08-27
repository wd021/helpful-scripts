import { readFileSync, writeFileSync } from "fs";
import path from "path";
import {
  LCDClient,
  MsgUpdateContractAdmin,
  Wallet,
  SimplePublicKey,
  MsgMigrateContract,
} from "@terra-money/terra.js";

const ARTIFACTS_PATH = "./artifacts";

export function writeArtifact(data: object, name: string = "artifacts") {
  writeFileSync(
    path.join(ARTIFACTS_PATH, `${name}.json`),
    JSON.stringify(data, null, 2)
  );
}

// Reads json containing contract addresses located in /artifacts folder. Naming convention : bombay-12 / columbus-5
export function readArtifact(name: string = "artifact") {
  try {
    const data = readFileSync(
      path.join(ARTIFACTS_PATH, `${name}.json`),
      "utf8"
    );
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

// export async function transfer_ownership_to_multisig(
//   terra: LCDClient,
//   wallet: Wallet,
//   multisig_address: string,
//   contract_address: string
// ) {
//   let msg = new MsgUpdateContractAdmin(
//     wallet.key.accAddress,
//     multisig_address,
//     contract_address
//   );
//   // TransferOwnership : TX
//   let tx = await performTransaction(terra, wallet, msg);
//   return tx;
// }
