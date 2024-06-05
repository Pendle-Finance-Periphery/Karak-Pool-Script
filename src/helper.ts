import { EthContext, getProvider } from "@sentio/sdk/eth";
import { CONFIG, MISC_CONSTS, PENDLE_POOL_ADDRESSES } from "./consts.js";
import os from 'os';

export type ShareMapping = Record<string, bigint>;

export function isSentioInternalError(err: any): boolean {
    if (
      err.code === os.constants.errno.ECONNRESET ||
      err.code === os.constants.errno.ECONNREFUSED ||
      err.code === os.constants.errno.ECONNABORTED ||
      err.toString().includes('ECONNREFUSED') ||
      err.toString().includes('ECONNRESET') ||
      err.toString().includes('ECONNABORTED')
    ) {
      return true;
    }
    return false;
  }

export function isPendleAddress(addr: string) {
    addr = addr.toLowerCase();
    return addr == PENDLE_POOL_ADDRESSES.SY ||
        addr == PENDLE_POOL_ADDRESSES.YT ||
        addr == PENDLE_POOL_ADDRESSES.LP;
}

// @TODO: to modify this when liquid lockers launch
export function isLiquidLockerAddress(addr: string) {
    addr = addr.toLowerCase();
    return PENDLE_POOL_ADDRESSES.LIQUID_LOCKERS.some((liquidLockerInfo) => liquidLockerInfo.address == addr);
}

export function getUnixTimestamp(date: Date) {
    return Math.floor(date.getTime() / 1000);
}

export function getSumShareMapping(...shareMappings: ShareMapping[]): ShareMapping {
    const result: ShareMapping = {};
    for (const shareMapping of shareMappings) {
        for (const [addr, share] of Object.entries(shareMapping)) {
            result[addr] = (result[addr] || 0n) + share;
        }
    }
    return result;
}

export function getTargetedTimestamp(timestamp: number) {
    let targetedTimestamp = (timestamp - timestamp % MISC_CONSTS.ONE_DAY_IN_SECONDS + CONFIG.TARGETED_TIMESTAMP);
    if (targetedTimestamp > timestamp) {
        targetedTimestamp -= MISC_CONSTS.ONE_DAY_IN_SECONDS;
    }
    return targetedTimestamp;
}

export async function getTargetedBlock(ctx: EthContext, targetedTimestamp: number): Promise<number> {
    const provider = getProvider(ctx.chainId)!;
    let curTimestamp = getUnixTimestamp(ctx.timestamp);
    let curBlockNumber = Number(ctx.blockNumber);

    let l = -1, r = -1;

    for(let i = 0; i < 20; ++i) {
        if (curTimestamp < targetedTimestamp) {
            let nextBlock = (await provider.getBlock(curBlockNumber + 1))!;
            const nextTimestamp = nextBlock.timestamp;
            if (nextTimestamp >= targetedTimestamp) {
                return curBlockNumber;
            }
        }

        
        const diff = Math.abs(targetedTimestamp - curTimestamp);
        const diffInBlock = Math.ceil(diff / MISC_CONSTS.AVERAGE_SECOND_PER_BLOCK) * (targetedTimestamp < curTimestamp ? -1 : 1);

        let projectedBlockNumber = curBlockNumber + diffInBlock;
        const projectedBlock = (await provider.getBlock(projectedBlockNumber))!;
        const projectedTimestamp = Number(projectedBlock.timestamp);

        if (projectedTimestamp > targetedTimestamp) {
            r = projectedBlockNumber;
        } else {
            l = projectedBlockNumber;
        }

        curTimestamp = projectedTimestamp;
        curBlockNumber = projectedBlockNumber;
    }

    if (l == -1 || r == -1) {
        throw new Error("getTargetedBlock: l, r = -1 after 20 iterations.");
    }

    // if at this stage, we still cannot find the targeted block, we can binary search
    while (l + 1 < r) {
        const mid = (l + r) >> 1;
        const midBlock = (await provider.getBlock(mid))!;
        const midTimestamp = Number(midBlock.timestamp);
        if (midTimestamp > targetedTimestamp) {
            r = mid;
        } else {
            l = mid;
            curBlockNumber = mid;
        }
    }

    return curBlockNumber;
}