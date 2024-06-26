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
    id: 'Karak USDE mainnet (September)',
    SY: '0xfe2d379117895fa6144b209c13894a17ab18c86c',
    YT: '0x2e40d7cfee1e7d31d1f4875e6f33b2c9a17038ff',
    LP: '0x1bcbdb8c8652345a5acf04e6e74f70086c68fefc',
    MULTICALL: '0xca11bde05977b3631167028862be2a173976ca11',
    START_BLOCK: 19967899,
    TREASURY: '0x8270400d528c34e1596ef367eedec99080a1b592',
    PENPIE_RECEIPT_TOKEN: '0x0980be7cc405ae7c31cc39e1dd1ee77483c1a430',
    EQB_STAKING: '0x6fdf80071499b46bb53afba7baff9d91a21133ab',
    STAKEDAO_RECEIPT_TOKEN: '0x58779f66966875f0df78b445526c69a3bf8e6534',
    LIQUID_LOCKERS: [
      {
        // Penpie
        address: '0x6e799758cee75dae3d84e09d40dc416ecf713652',
        receiptToken: '0x0980be7cc405ae7c31cc39e1dd1ee77483c1a430',
      },
      {
        // EQB
        address: '0x64627901dadb46ed7f275fd4fc87d086cff1e6e3',
        receiptToken: '0x6fdf80071499b46bb53afba7baff9d91a21133ab',
      },
      {   // STAKEDAO
          address: '0xd8fa8dc5adec503acc5e026a98f32ca5c1fa289a',
          receiptToken: '0x58779f66966875f0df78b445526c69a3bf8e6534',
      }
    ],
  };
  