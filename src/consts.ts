import { EthChainId } from '@sentio/sdk/eth'



export const MISC_CONSTS = {
    ONE_E18: BigInt("1000000000000000000"),
    ONE_DAY_IN_MINUTE: 60 * 24,
    ONE_DAY_IN_SECONDS: 60 * 60 * 24,
    ONE_HOUR_IN_SECONDS: 60 * 60,
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    AVERAGE_SECOND_PER_BLOCK: 12,
    MULTICALL: "0xca11bde05977b3631167028862be2a173976ca11",
}

export const CONFIG = {
    BLOCKCHAIN: EthChainId.ETHEREUM,
    SNAPSHOT_FREQUENCY: 24 * 60, // 1 day in minute
    TARGETED_TIMESTAMP: 57600, // 4pm UTC
    MULTICALL_BATCH: 250,
}

export const PENDLE_POOL_ADDRESSES = {
    id: 'Karak SUSDE mainnet (September)',
    SY: '0x1b641894e66aec7bf5ab86517e8d81763cc8e19e',
    YT: '0xdd68f5d26bf1182d6b241108bfc01f95c030502b',
    LP: '0xb1f587b354a4a363f5332e88effbbc2e4961250a',
    MULTICALL: '0xca11bde05977b3631167028862be2a173976ca11',
    START_BLOCK: 19967918,
    TREASURY: '0x8270400d528c34e1596ef367eedec99080a1b592',
    PENPIE_RECEIPT_TOKEN: '0x1c055d8081ca3b2be0dd00abe784b142c608219e',
    EQB_STAKING: '0xcb7212d19d52b53e44625dc1a9d4b1f1d4833575',
    STAKEDAO_RECEIPT_TOKEN: '0xe492c6ba9a458ef0f44581e82d6da885b99d4027',
    LIQUID_LOCKERS: [
      {
        // Penpie
        address: '0x6e799758cee75dae3d84e09d40dc416ecf713652',
        receiptToken: '0x1c055d8081ca3b2be0dd00abe784b142c608219e',
      },
      {
        // EQB
        address: '0x64627901dadb46ed7f275fd4fc87d086cff1e6e3',
        receiptToken: '0xcb7212d19d52b53e44625dc1a9d4b1f1d4833575',
      },
      {   // STAKEDAO
          address: '0xd8fa8dc5adec503acc5e026a98f32ca5c1fa289a',
          receiptToken: '0xe492c6ba9a458ef0f44581e82d6da885b99d4027',
      }
    ],
  };
  