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
    SY: '0x8db42af6b2de9e8aee47f3423570d8e9c3873796',
    YT: '0x5439c3ef0072e4a19c44478cdf947f5d957e66c7',
    LP: '0x18bafcabf2d5898956ae6ac31543d9657a604165',
    MULTICALL: '0xca11bde05977b3631167028862be2a173976ca11',
    START_BLOCK: 19967933,
    TREASURY: '0x8270400d528c34e1596ef367eedec99080a1b592',
    PENPIE_RECEIPT_TOKEN: '0xc683e9a72a2cc87b2110cf680705a21a637fe04e',
    EQB_STAKING: '0xb55a1785a2edaddad3d373b4ecf5916b9d066733',
    STAKEDAO_RECEIPT_TOKEN: '0x0b493988b2425218068767f18dd1ecf2f0084c3d',
    LIQUID_LOCKERS: [
      {
        // Penpie
        address: '0x6e799758cee75dae3d84e09d40dc416ecf713652',
        receiptToken: '0xc683e9a72a2cc87b2110cf680705a21a637fe04e',
      },
      {
        // EQB
        address: '0x64627901dadb46ed7f275fd4fc87d086cff1e6e3',
        receiptToken: '0xb55a1785a2edaddad3d373b4ecf5916b9d066733',
      },
      {   // STAKEDAO
          address: '0xd8fa8dc5adec503acc5e026a98f32ca5c1fa289a',
          receiptToken: '0x0b493988b2425218068767f18dd1ecf2f0084c3d',
      }
    ],
  };
  