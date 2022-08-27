import {
  LCDClient,
  LegacyAminoMultisigPublicKey,
  MsgExecuteContract,MsgMigrateContract, MsgUpdateContractAdmin,
  SimplePublicKey
} from "@terra-money/terra.js"
import { writeFileSync } from "fs"
import 'dotenv/config.js'
import { writeArtifact, readArtifact } from "./helpers"

// CONSTS
// const deployer_address = "terra17ms5h47n3vf40wt6cavpr4kje66p5t74r8f90u";


if (!(process.env.CHAIN_ID
  && process.env.LCD_CLIENT_URL
  && process.env.MULTISIG_PUBLIC_KEYS
  && process.env.MULTISIG_THRESHOLD
)) {
  throw new Error("One or more required environment variables are missing")
}

// Terra network details:
const CHAIN_ID = process.env.CHAIN_ID
const LCD_CLIENT_URL = process.env.LCD_CLIENT_URL
// Multisig details:
const MULTISIG_PUBLIC_KEYS = process.env.MULTISIG_PUBLIC_KEYS
  .split(",")
  // terrad sorts keys of multisigs by comparing bytes of their address
  .sort((a, b) => {
    return Buffer.from(
      new SimplePublicKey(a).rawAddress()
    ).compare(
      Buffer.from(
        new SimplePublicKey(b).rawAddress()
      )
    )
  })
  .map(x => new SimplePublicKey(x))
const MULTISIG_THRESHOLD = parseInt(process.env.MULTISIG_THRESHOLD);




// MAIN

(async () => {
  const terra = new LCDClient({
    URL: LCD_CLIENT_URL,
    chainID: CHAIN_ID
  })

  if (CHAIN_ID != "phoenix-1") {
    console.log("Chain ID needs to be Columbus-5")
    return
  }

  // NETWORK FILE -::- CONTAINS ADDRESSES
  let network = readArtifact(terra.config.chainID);

  const multisigPubKey = new LegacyAminoMultisigPublicKey(MULTISIG_THRESHOLD, MULTISIG_PUBLIC_KEYS)

  // MultiSig address
  const multisigAddress = multisigPubKey.address()
  console.log("ASTRO Multisig :: ", multisigAddress)

  const accInfo = await terra.auth.accountInfo(multisigAddress)
  console.log("Sequence Number : ", accInfo.getSequenceNumber())
  console.log("Account Number : ", accInfo.getAccountNumber())

  // let msg =


  // GENERATOR - CREATE VESTING SCHEDULE
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
  //         "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
  //         { send : { contract: "terra1qyuarnzcc6uuft9n9mltraprreke4v8gvxd8u3nslngxhflhru9qw34nc3",
  //                    amount: "100000000000000",
  //                    msg: toEncodedBinary( {
  //                     register_vesting_accounts: {
  //                         vesting_accounts: [
  //                             {
  //                                 address: "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
  //                                 schedules: [
  //                                     {
  //                                         start_point: {
  //                                             time: 1654599600,
  //                                             amount: String("1000000000000") // 1% on total supply at once
  //                                         },
  //                                         end_point: {
  //                                             time: 1686135600,
  //                                             amount: String("100000000000000")
  //                                         }
  //                                     }
  //                                 ]
  //                             }
  //                         ]
  //                     }
  //                 })
  //                  } 
  //         }
  //       )
  //     ],
  //     // memo: "ASTROPORT -::- Generator -::- Update ASTRO tokens distributed per block"
  //   }
  // )


  // ADD LP TOKEN TO THE GENERATOR 
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
  //       // Luna-axlUSDC  LP TOKENS
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
  //         {   add : {
  //             lp_token: "terra1ckmsqdhlky9jxcmtyj64crgzjxad9pvsd58k8zsxsnv4vzvwdt7qke04hl",
  //             alloc_point: "40000",
  //             with_update: true,
  //             has_asset_rewards: false
  //             }
  //         }
  //       ),
  //       // ASTRO-axlUSDC LP TOKENS
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
  //         { add : {
  //             lp_token: "terra16esjk7qqlgh8w7p2a58yxhgkfk4ykv72p7ha056zul58adzjm6msvc674t",
  //             alloc_point: "30000",
  //             with_update: true,
  //             has_asset_rewards: false
  //           }
  //         }
  //       ),
  //       // axlUSDC-axlUSDT LP TOKENS
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
  //         { add : {
  //             lp_token: "terra1khsxwfnzuxqcyza2sraxf2ngkr3dwy9f7rm0uts0xpkeshs96ccsqtu6nv",
  //             alloc_point: "15000",
  //             with_update: true,
  //             has_asset_rewards: false
  //           }
  //         }
  //       ),
  //       // Lunax-Luna  LP TOKENS
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
  //         { add : {
  //             lp_token: "terra1kggfd6z0ad2k9q8v24f7ftxyqush8fp9xku9nyrjcs2wv0e4kypszfrfd0",
  //             alloc_point: "15000",
  //             with_update: true,
  //             has_asset_rewards: false
  //           }
  //         }
  //       ),
  //     ],
  //     // "memo": "Astroport Generator -::- Set alloc_points for nLUNA-PSI, stLUNA-LUNA, stSOL-UST, stETH-UST LPs"
  //   }
  // )

        // // ORION-UST LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { set : {
        //       lp_token: "terra1w80npmymwhdtvcmrg44xmqqdnufu3gyfaytr9z",
        //       alloc_point: "26111",
        //       with_update: true,
        //     }
        //   }
        // ),
        // // APOLLO-UST LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { set : {
        //       lp_token: "terra1zuktmswe9zjck0xdpw2k79t0crjk86fljv2rm0",
        //       alloc_point: "18277",
        //       with_update: true,
        //     }
        //   }
        // ),

        // // STT-UST LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { set : {
        //       lp_token: "terra14p4srhzd5zng8vghly5artly0s53dmryvg3qc6",
        //       alloc_point: "33944",
        //       with_update: true,
        //     }
        //   }
        // ),
        // // VKR-UST LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { set : {
        //       lp_token: "terra1lw36qqz72mxajrfgkv24lahudq3ehmkpc305yc",
        //       alloc_point: "18277",
        //       with_update: true,
        //     }
        //   }
        // ),
        // // MIR-UST LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { set : {
        //       lp_token: "terra17trxzqjetl0q6xxep0s2w743dhw2cay0x47puc",
        //       alloc_point: "33944",
        //       with_update: true,
        //     }
        //   }
        // ),
        // // xDEFI-UST LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { set : {
        //       lp_token: "terra1krvq5hk3a37yeydzfrgjj00d8xygk5um9jas8p",
        //       alloc_point: "15666",
        //       with_update: true,
        //     }
        //   }
        // )

        // // MINE-UST LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { add : {
        //       lp_token: "terra16unvjel8vvtanxjpw49ehvga5qjlstn8c826qe",
        //       alloc_point: "36555",
        //       with_update: true,
        //       reward_proxy: "terra1gty5d3hmegmrzu7uyrrm6mcksus5cumkrxxg0z"
        //     }
        //   }
        // ),
        // // PSI-UST LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { add : {
        //       lp_token: "terra1cspx9menzglmn7xt3tcn8v8lg6gu9r50d7lnve",
        //       alloc_point: "23500",
        //       with_update: true,
        //       reward_proxy: "terra1vtqv4j5v04x5ka5f84v9zuvt604u2rsqhjnpk8"
        //     }
        //   }
        // ),
        // // nETH-PSI LP TOKENS
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
        //   { add : {
        //       lp_token: "terra1pjfqacx7k6dg63v2h5q96zjg7w5q25093wnkjc",
        //       alloc_point: "15666",
        //       with_update: true,
        //       reward_proxy: "terra14fjehqxs03mad28tflkk7lqdru64h9cdsdm923"
        //     }
        //   }
        // )          

  //       // nLUNA-PSI LP TOKENS
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
  //         { add : {
  //             lp_token: "terra1t53c8p0zwvj5xx7sxh3qtse0fq5765dltjrg33",
  //             alloc_point: "18277",
  //             with_update: true,
  //             reward_proxy: "terra17jm985ql5plu8ytakpfz6kjyag87m9f3l3aqfn"
  //           }
  //         }
  //       ),
  //       // stLUNA-LUNA LP TOKENS
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
  //         { add : {
  //             lp_token: "terra1h2lasu3a5207yt7decg0s09z5ltw953nrgj820",
  //             alloc_point: "94000",
  //             with_update: true,
  //             reward_proxy: "terra1hzkn3wr8qhmml6yu575tlz48j2lhgdahvx2ruk"
  //           }
  //         }
  //       ),
  //       // stSOL-UST LP TOKENS
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
  //         { add : {
  //             lp_token: "terra1cgvlpz6vltqa49jlj3yr2ddnwy22xw62k4433t",
  //             alloc_point: "15666",
  //             with_update: true,
  //             reward_proxy: "terra19ganxu5n5xghz0ftp6jfczl5yf38yryctprmd2"
  //           }
  //         }
  //       ),
  //       // stETH-UST LP TOKENS
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
  //         { add : {
  //             lp_token: "terra1qz4cv5lsfw4k2266q52z9rtz64n58paxy9d476",
  //             alloc_point: "15673",
  //             with_update: true,
  //             reward_proxy: "terra15re9z6l28vf4dfeu8zyfe8ax8cvjdxkfnmuwne"
  //           }
  //         }
  //       )                        


  // "generator_proxy_to_mine_ust_contract": "terra1gty5d3hmegmrzu7uyrrm6mcksus5cumkrxxg0z",
  // "generator_proxy_to_psi_ust_contract": "terra1vtqv4j5v04x5ka5f84v9zuvt604u2rsqhjnpk8",
  // "generator_proxy_to_nexus_nETH_PSI_contract": "terra14fjehqxs03mad28tflkk7lqdru64h9cdsdm923",
  // "generator_proxy_to_nexus_nLUNA_PSI_contract": "terra17jm985ql5plu8ytakpfz6kjyag87m9f3l3aqfn",
  // "generator_proxy_to_wsstSOL_UST_contract": "terra19ganxu5n5xghz0ftp6jfczl5yf38yryctprmd2",
  // "generator_proxy_to_wewstETH_UST_contract": "terra15re9z6l28vf4dfeu8zyfe8ax8cvjdxkfnmuwne",
  // "generator_proxy_to_stLUNA_uluna_contract": "terra1hzkn3wr8qhmml6yu575tlz48j2lhgdahvx2ruk"

  // GENERATOR - UPDATE TOKENS PER BLOCK
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
  //         "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
  //         { "transfer" : { "recipient": "terra1lp5qpaew3j7st98yslnrj4r63yke8vwc34y6uf5jcdu35va059dsxye54j", "amount": "1951641237252" } }
  //       )

        // { send : { contract: "terra15hlvnufpk8a3gcex09djzkhkz3jg9dpqvv6fvgd0ynudtu2z0qlq2fyfaq", amount: "131912914908748", msg: toEncodedBinary({increase_astro_incentives:{}}) } }
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
        //   { set_tokens_per_block : { amount: "19025875" } }
        // )
  //     ],
  //     // memo: "ASTROPORT -::- Generator -::- Update ASTRO tokens distributed per block"
  //   }
  // )

  // ASTROPORT FACTORY -::- CREATE NEW POOL TYPE
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
  //         "terra1fnywlw4edny3vw44x04xd67uzkdqluymgreu7g",
  //         { update_pair_config : { config:  { code_id: 1793, pair_type: { custom: "XYK-2BPS"}, total_fee_bps: 30, maker_fee_bps:667, is_disabled:false  }  } }          
  //       )
  //     ],
  //     memo: "Initialize XYK Pool type with 2 bps maker fee"
  //   }
  // )



  // ADD PROXY CONTRACTS TO THE GENERATOR
  /*
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
        new MsgExecuteContract(
          multisigAddress,
          "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
          { add : {
              lp_token: "terra18mcmlf4v23ehukkh7qxgpf5tznzg6893fxmf9ffmdt9phgf365zqvmlug6",
              alloc_point: "0",
              reward_proxy: "terra14ewvq39vg23j0hcesecv6hkzkwkvrnuxzd5sddmry9lx6qrhaxcqjdx6er",
              has_asset_rewards: false 
            }
          }
        ), 

        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
        //   { set_allowed_reward_proxies : {
        //     proxies: [    
        //       "terra14ewvq39vg23j0hcesecv6hkzkwkvrnuxzd5sddmry9lx6qrhaxcqjdx6er",
        //   ]
        //     }
        //   }
        // ),
  //       // ORNE - UST
  //       new MsgExecuteContract(
  //         multisigAddress,
  //         "terra1zgrx9jjqrfye8swykfgmd6hpde60j0nszzupp9",
  //         { add : {
  //             lp_token: "terra1drradty46zqun4624p8a3sp9h5jfg9phwlgnm2",
  //             alloc_point: "0",
  //             reward_proxy: "terra1r9vxaprx2j2djyrse60yppawpuncm7wcujjc9w"
  //           }
  //         }
  //       ), 
      ],
    }
  )
  */

  // {
  //   "owner": "terra1c7m6j8ya58a2fkkptn8fgudx8sqjqvc8azq0ex",
  //   "astro_token": "terra1xj49zyqrwpv5k928jwfpfy2ha668nwdgkwlrg3",
  //   "tokens_per_block": "15854800",
  //   "total_alloc_point": "1000000",
  //   "start_block": "5918639",
  //   "allowed_reward_proxies": [
  //     "terra1wranc9ta64f0nwdyv842d7kdm7ae80kdl5tvne",
  //     "terra1e5zw6ujvzcmmgh8rxlttddlk2t62j2lh5jtwe8",
  //     "terra1v2wez00fyy8ajxgkh2jcx82haqfudvxcs5sdzr",
  //     "terra15g9we4hs03zv5lkmkpm3gk6vr5tfq8c6egxss6",
  //     "terra12z0q65r2y3y56g970fghfderncf4a2nurta0sc",
  //     "terra16pnm59kxmgnp9kv6ye3ejnpevfmzdlllx0pake",
  //     "terra1px6vx9uegszfycw9z75dfpmzqtwjtrpm20qck2",
  //     "terra1gty5d3hmegmrzu7uyrrm6mcksus5cumkrxxg0z",
  //     "terra1vtqv4j5v04x5ka5f84v9zuvt604u2rsqhjnpk8",
  //     "terra14fjehqxs03mad28tflkk7lqdru64h9cdsdm923",
  //     "terra17jm985ql5plu8ytakpfz6kjyag87m9f3l3aqfn",
  //     "terra19ganxu5n5xghz0ftp6jfczl5yf38yryctprmd2",
  //     "terra15re9z6l28vf4dfeu8zyfe8ax8cvjdxkfnmuwne",
  //     "terra1hzkn3wr8qhmml6yu575tlz48j2lhgdahvx2ruk",
  //     "terra1aqehsnrdadp7s8exny69h5vln3llp38wttv0cr"
  //   ],
  //   "vesting_contract": "terra1hncazf652xa0gpcwupxfj6k4kl4k4qg64yzjyf"
  // }

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
  //         "terra1qswfc7hmmsnwf7f2nyyx843sug60urnqgz75zu",
  //         { update_config : { params: toEncodedBinary( {start_changing_amp: { next_amp: 10, next_amp_time:1647862200 } } ) } }
          
  //       )
  //     ],
  //     feeDenoms: ['uusd']
  //   }
  // )



  // UPDATE AND MIGRATE MAKER
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
  //       // whUSDC-UST
  //       new MsgMigrateContract(
  //         multisigAddress,
  //         "terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450",
  //         4007,
  //         {},
  //       ),
  //       // LUNAX - LUNA 
  //       new MsgMigrateContract(
  //         multisigAddress,
  //         "terra1qswfc7hmmsnwf7f2nyyx843sug60urnqgz75zu",
  //         4007,
  //         {},
  //       ),
  //       // bETH-wETH 
  //       new MsgMigrateContract(
  //         multisigAddress,
  //         "terra1wgdjvp388mlvhad8u7ly5d34ga4zyyfvf3e5j8",
  //         4007,
  //         {},
  //       ),
  //       // wBUSD - UST
  //       new MsgMigrateContract(
  //         multisigAddress,
  //         "terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx",
  //         4007,
  //         {},
  //       )
  //     ],
  //   }
  // )
// LUNAX - LUNA - terra1qswfc7hmmsnwf7f2nyyx843sug60urnqgz75zu
// whUSDC-UST Pair - terra1cevdyd0gvta3h79uh5t47kk235rvn42gzf0450
// bETH-wETH - terra1wgdjvp388mlvhad8u7ly5d34ga4zyyfvf3e5j8
// wBUSD - UST - terra1szt6cq52akhmzcqw5jhkw3tvdjtl4kvyk3zkhx

  

//   soUSDC-UST Pair - terra1cc6kqk0yl25hdpr5llxmx62mlyfdl7n0rwl3hq
// avUSDC-UST Pair - terra1qmxkqcgcgq8ch72k6kwu3ztz6fh8tx2xd76ws7






  // // Update Code If in Factory
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
  //       new MsgMigrateContract(
  //         multisigAddress,
  //         "terra1r5m5h9nvnw0hhzwn4gzz9p2wzg78q2jsq0alvp",
  //         4007,
  //         {},
  //       ),
  //       new MsgMigrateContract(
  //         multisigAddress,
  //         "terra1dawj5mr2qt2nlurge30lfgjg6ly4ls99yeyd25",
  //         4007,
  //         {},
  //       ),
  //       new MsgMigrateContract(
  //         multisigAddress,
  //         "terra158utlakp85amnlkxtyk8m7jh9x3nxjyff2af9c",
  //         4007,
  //         {},
  //       ),
  //     ],
  //   }
  // )

  // new MsgUpdateContractAdmin(
  //   multisigAddress,
  //   "terra1sq9ppsvt4k378wwhvm2vyfg7kqrhtve8p0n3a6",
  //   4007,
  //   {},
  // ),


  // CLAIM OWNERSHIP
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
        // new MsgUpdateContractAdmin(
        //  multisigAddress,
        //  multisig_address,
        //  contract_address
        // )
        // new MsgExecuteContract(
        //   multisigAddress,
        //   "terra12ncurr62xe93xrsh2drp4zvehj0gn32lfnshr8k0p4xfyju2knwq2qgmh2",
        //   {
        //    update_admins: {
        //      admins: [
        //        "terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq"
        //      ]
        //    }
        //  }
        // )
        // new MsgExecuteContract(
        //  multisigAddress,
        //  "terra1ksvlfex49desf4c452j6dewdjs6c48nafemetuwjyj6yexd7x3wqvwa7j9",
        //  {
        //    propose_new_owner: {
        //      owner: "terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq",
        //      expires_in: 1661882400,
        //    },
        //  }
        // ),
        // new MsgExecuteContract(
        //  multisigAddress,
        //  "terra15hlvnufpk8a3gcex09djzkhkz3jg9dpqvv6fvgd0ynudtu2z0qlq2fyfaq",
        //  { update_config : { params: toEncodedBinary({owner: "terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq"}) } }
        // ),
        new MsgExecuteContract(
          multisigAddress,
          "terra15hlvnufpk8a3gcex09djzkhkz3jg9dpqvv6fvgd0ynudtu2z0qlq2fyfaq",
          { update_config: { owner: "terra1k9j8rcyk87v5jvfla2m9wp200azegjz0eshl7n2pwv852a7ssceqsnn7pq" } }
        ),
        // new MsgExecuteContract(
        //  multisigAddress,
        //  "terra1nsuqsk6kh58ulczatwev87ttq2z6r3pusulg9r24mfj2fvtzd4uq3exn26",
        //  { "transfer" : { "recipient": "terra12ncurr62xe93xrsh2drp4zvehj0gn32lfnshr8k0p4xfyju2knwq2qgmh2", "amount": "566135443853000" } }
        // )
      ]
    }
  );

    // { "transfer" : { "recipient": "terra1hs8mpq07wmknndm59es93tzravgzua0lmgcjk3", "amount": "300000000001000" } }
    // { update_bridges : { add: [
          //   [{
          //     "token": { "contract_addr": "terra14xsm2wzvu7xaf567r693vgfkhmvfs08l68h4tjj5wjgyn5ky8e2qvzyanh" }
          //   },
          //   {
          //     "native_token": { "denom": "uluna" }
          //   }],
          //   [{
          //     "token": { "contract_addr": "ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF" }
          //   },
          //   {
          //     "token": { "contract_addr": "ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4" }
          //   }]
          // ]
          // } 
          // }          

    // {
    //   msgs: [
    //     new MsgExecuteContract(
    //       multisigAddress,
    //       "terra14x9fr055x5hvr48hzy2t4q7kvjvfttsvxusa4xsdcy702mnzsvuqprer8r",
    //       { claim_ownership : { } }
          
    //     )
    //   ]
    // }
  // )

  const unsignedTxFilename = `24_update_airdrop_owner_unsigned.json`

  writeFileSync(unsignedTxFilename, JSON.stringify(tx.toData()))

  console.log("24_update_airdrop_owner_unsigned .JSON successfully created")


  // Run `broadcast_tx.ts` to aggregate at least K of N signatures and broadcast the signed tx to the network
})()



export function toEncodedBinary(object: any) {
  return Buffer.from(JSON.stringify(object)).toString('base64');
}


// Set all the bridges so we can swap fees to ASTRO. For LUNAX, we need a bridge to LUNA and then to ASTRO (LUNA & ASTRO have a direct pair so I think only the bridge to LUNA is needed). For axlUSDT, we need a bridge to axlUSDC and then to ASTRO (same as on LUNAX, think we only need 1 bridge to axlUSDT)
// The address for axlUSDC is ibc/B3504E092456BA618CC28AC671A71FB08C6CA0FD0BE7C8A5B5A3E2DD933CC9E4, the address for axlUSDT is ibc/CBF67A2BCF6CAE343FDF251E510C8E18C361FC02B23430C121116E0811835DEF and the LUNAX address is terra14xsm2wzvu7xaf567r693vgfkhmvfs08l68h4tjj5wjgyn5ky8e2qvzyanh (edited) 