import { AsyncNedb } from "nedb-async";
import { TransferEvent } from "../types/eth/pendlemarket.js";
import { ERC20Context } from "@sentio/sdk/eth/builtin/erc20";
import { isPendleAddress, ShareMapping } from "../helper.js";
import { EthContext } from "@sentio/sdk/eth";
import { readAllUserERC20Balances } from "../multicall.js";
import { PENDLE_POOL_ADDRESSES } from "../consts.js";

const db = new AsyncNedb({
  filename: "/data/pendle-accounts-sy.db",
  autoload: true,
});

type AccountSnapshot = {
  _id: string;
};

db.persistence.setAutocompactionInterval(60 * 1000);

export async function handleSYTransfer(evt: TransferEvent, _: ERC20Context) {
  for (let addr of [evt.args.from, evt.args.to]) {
    const newSnapshot: AccountSnapshot = {
      _id: addr.toLowerCase(),
    };
    if (isPendleAddress(addr)) {
      continue;
    }
    await db.asyncUpdate({ _id: newSnapshot._id }, newSnapshot, { upsert: true });
  }
}

export async function takeSYSnapshot(ctx: EthContext, blockNumber: number): Promise<ShareMapping> {
  const allUsers = (await db.asyncFind<AccountSnapshot>({})).map((x) => x._id);
  const allSYBalances = await readAllUserERC20Balances(ctx, allUsers, PENDLE_POOL_ADDRESSES.SY, blockNumber);
  const result: ShareMapping = {};
  for (let i = 0; i < allUsers.length; i++) {
    result[allUsers[i]] = allSYBalances[i];
  }
  return result;
}