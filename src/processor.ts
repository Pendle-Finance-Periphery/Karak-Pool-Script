import { ERC20Processor } from '@sentio/sdk/eth/builtin'
import { PENDLE_POOL_ADDRESSES, CONFIG, MISC_CONSTS } from './consts.js'
import { handleSYTransfer, takeSYSnapshot } from './handlers/SY.js'
import { PendleYieldTokenProcessor } from './types/eth/pendleyieldtoken.js'
import { handleYTTransfer, takeYTSnapshot } from './handlers/YT.js'
import { PendleMarketProcessor, getPendleMarketContractOnContext } from './types/eth/pendlemarket.js'
import { addLpUsers, handleLPTransfer, takeLPSnapshot } from './handlers/LP.js'
import { EQBBaseRewardProcessor } from './types/eth/eqbbasereward.js'
import { GLOBAL_CONFIG } from "@sentio/runtime";
import { getSumShareMapping, getTargetedBlock, getTargetedTimestamp, getUnixTimestamp } from './helper.js'
import { EthContext } from '@sentio/sdk/eth'

GLOBAL_CONFIG.execution = {
  sequential: true,
};

async function takeGlobalSnapshot(ctx: EthContext, blockNumber: number, timestamp: number) {
  const userShares = getSumShareMapping(
    await takeYTSnapshot(ctx, blockNumber),
    await takeLPSnapshot(ctx, blockNumber)
  );

  for (const user in userShares) {
    ctx.eventLogger.emit("UserDailyShare", {
      user,
      share: userShares[user],
      recordedAtTimestamp: timestamp,
      recordedAtBlock: blockNumber,
    })
  }

  ctx.eventLogger.emit("DailyUpdateBlock", {
    recordedAtTimestamp: timestamp,
    recordedAtBlock: blockNumber,
  })
}

ERC20Processor.bind({
  address: PENDLE_POOL_ADDRESSES.SY,
  startBlock: PENDLE_POOL_ADDRESSES.START_BLOCK,
  name: "Pendle Pool SY",
  network: CONFIG.BLOCKCHAIN
}).onEventTransfer(async (evt, ctx) => {
  await handleSYTransfer(evt, ctx);
})


PendleYieldTokenProcessor.bind({
  address: PENDLE_POOL_ADDRESSES.YT,
  startBlock: PENDLE_POOL_ADDRESSES.START_BLOCK,
  name: "Pendle Pool YT",
  network: CONFIG.BLOCKCHAIN

}).onEventTransfer(async (evt, ctx) => {
  await handleYTTransfer(evt, ctx);
})

PendleMarketProcessor.bind({
  address: PENDLE_POOL_ADDRESSES.LP,
  startBlock: PENDLE_POOL_ADDRESSES.START_BLOCK,
  name: "Pendle Pool LP",
  network: CONFIG.BLOCKCHAIN
}).onEventTransfer(async (evt, ctx) => {
  await handleLPTransfer(evt, ctx);
}).onTimeInterval(async (blk, ctx) => {
  const timestamp = getUnixTimestamp(ctx.timestamp);
  const targetedTimestamp = getTargetedTimestamp(timestamp);  
  if (timestamp - targetedTimestamp > MISC_CONSTS.ONE_HOUR_IN_SECONDS) {
    return;
  }
  
  const targetedBlock = await getTargetedBlock(ctx, targetedTimestamp);
  if (targetedBlock < PENDLE_POOL_ADDRESSES.START_BLOCK) {
    return;
  }

  await takeGlobalSnapshot(ctx, targetedBlock, targetedTimestamp);
}, 60, 60); // one day

EQBBaseRewardProcessor.bind({
  address: PENDLE_POOL_ADDRESSES.EQB_STAKING,
  startBlock: PENDLE_POOL_ADDRESSES.START_BLOCK,
  name: "Equilibria Base Reward",
  network: CONFIG.BLOCKCHAIN
}).onEventStaked(async (evt, ctx) => {
  await addLpUsers(evt.args._user);
})

ERC20Processor.bind({
  address: PENDLE_POOL_ADDRESSES.PENPIE_RECEIPT_TOKEN,
  startBlock: PENDLE_POOL_ADDRESSES.START_BLOCK,
  name: "Penpie Receipt Token",
  network: CONFIG.BLOCKCHAIN
}).onEventTransfer(async (evt, ctx) => {
  await addLpUsers(evt.args.from);
  await addLpUsers(evt.args.to);
});


ERC20Processor.bind({
  address: PENDLE_POOL_ADDRESSES.STAKEDAO_RECEIPT_TOKEN,
  startBlock: PENDLE_POOL_ADDRESSES.START_BLOCK,
  name: "Stakedao Receipt Token",
  network: CONFIG.BLOCKCHAIN
}).onEventTransfer(async (evt, ctx) => {
  await addLpUsers(evt.args.from);
  await addLpUsers(evt.args.to);
});