import { AsyncNedb } from "nedb-async";
import {
  getPendleMarketContractOnContext,
  PendleMarketContext,
  TransferEvent,
} from "../types/eth/pendlemarket.js";
import { EthContext } from "@sentio/sdk/eth";
import { readAllUserActiveBalances, readAllUserERC20Balances } from "../multicall.js";
import { PENDLE_POOL_ADDRESSES } from "../consts.js";
import { getUnixTimestamp, isLiquidLockerAddress, isSentioInternalError, ShareMapping } from "../helper.js";

const db = new AsyncNedb({
  filename: "/data/pendle-accounts-lp.db",
  autoload: true,
});
type AccountSnapshot = {
  _id: string;
};

db.persistence.setAutocompactionInterval(60 * 1000);

export async function handleLPTransfer(
  evt: TransferEvent,
  _: PendleMarketContext
) {
  await addLpUsers(evt.args.from);
  await addLpUsers(evt.args.to);
}

export async function addLpUsers(addr: string) {
  const newSnapshot: AccountSnapshot = {
    _id: addr.toLowerCase(),
  };
  await db.asyncUpdate({ _id: newSnapshot._id }, newSnapshot, { upsert: true });
}

export async function takeLPSnapshot(ctx: EthContext, blockNumber: number): Promise<ShareMapping> {
  const allUsers = (await db.asyncFind<AccountSnapshot>({})).map((x) => x._id);

  const marketContract = getPendleMarketContractOnContext(
    ctx,
    PENDLE_POOL_ADDRESSES.LP
  );

  // read raw datas
  const [allUserShares, totalShare, state] = await Promise.all([
    readAllUserActiveBalances(ctx, allUsers, blockNumber),
    marketContract.totalActiveSupply({blockTag: blockNumber}),
    marketContract.readState(marketContract.address, {blockTag: blockNumber}),
  ]);

  // Process liquid lockers
  for (const liquidLocker of PENDLE_POOL_ADDRESSES.LIQUID_LOCKERS) {
    const liquidLockerBal = await marketContract.balanceOf(
      liquidLocker.address,
      {blockTag: blockNumber}
    );
    if (liquidLockerBal == 0n) continue;

    const liquidLockerActiveBal = await marketContract.activeBalance(
      liquidLocker.address,
      {blockTag: blockNumber}
    );
    try {
      const allUserReceiptTokenBalances = await readAllUserERC20Balances(
        ctx,
        allUsers,
        liquidLocker.receiptToken,
        blockNumber
      );
      for (let i = 0; i < allUsers.length; i++) {
        const userBal = allUserReceiptTokenBalances[i];
        const userBoostedHolding =
          (userBal * liquidLockerActiveBal) / liquidLockerBal;
        allUserShares[i] += userBoostedHolding;
      }
    } catch (err) { 
      if (isSentioInternalError(err)) {
        throw err;
      }
    }
  }

  const result: ShareMapping = {};
  for (let i = 0; i < allUsers.length; i++) {
    const account = allUsers[i];
    const impliedSy = (allUserShares[i] * state.totalSy) / totalShare;
    if (!isLiquidLockerAddress(account)) {
      result[account] = impliedSy;
    }
  }
  return result;
}