import { sha256 } from "js-sha256";

export type LedgerBlock<T> = {
  index: number;
  timestamp: number;
  walletOwner: string;
  data: T;
  prevHash: string;
  hash: string;
};

const computeHash = <T>(payload: Omit<LedgerBlock<T>, "hash">): string =>
  sha256(payload.index + payload.timestamp + payload.walletOwner + JSON.stringify(payload.data) + payload.prevHash);

const genesis = <T>(): LedgerBlock<T> => ({
  index: 0,
  timestamp: Date.now(),
  walletOwner: "genesis-wallet",
  data: {} as T,
  prevHash: "",
  hash: "",
});

export class TokenLedger<T> {
  private chain: LedgerBlock<T>[];

  constructor(initialChain?: LedgerBlock<T>[]) {
    const base = initialChain?.length ? initialChain : [genesis<T>()];
    this.chain = this.rehash(base);
  }

  private rehash(blocks: LedgerBlock<T>[]) {
    return blocks.map((block, idx) => {
      const prepared: Omit<LedgerBlock<T>, "hash"> = {
        index: idx,
        timestamp: block.timestamp,
        walletOwner: block.walletOwner,
        data: block.data,
        prevHash: idx === 0 ? "" : blocks[idx - 1].hash,
      };
      return { ...prepared, hash: computeHash(prepared) };
    });
  }

  append(data: T, walletOwner: string): LedgerBlock<T> {
    const prevBlock = this.chain[this.chain.length - 1];
    const nextIndex = this.chain.length;
    const base: Omit<LedgerBlock<T>, "hash"> = {
      index: nextIndex,
      timestamp: Date.now(),
      walletOwner,
      data,
      prevHash: prevBlock.hash,
    };
    const block: LedgerBlock<T> = { ...base, hash: computeHash(base) };
    this.chain = [...this.chain, block];
    return block;
  }

  validate(): boolean {
    for (let i = 1; i < this.chain.length; i += 1) {
      const current = this.chain[i];
      const prev = this.chain[i - 1];
      const expectedPrev = prev.hash;
      const expectedHash = computeHash({
        index: current.index,
        timestamp: current.timestamp,
        walletOwner: current.walletOwner,
        data: current.data,
        prevHash: current.prevHash,
      });
      if (current.prevHash !== expectedPrev || current.hash !== expectedHash) {
        return false;
      }
    }
    return true;
  }

  snapshot(): LedgerBlock<T>[] {
    return [...this.chain];
  }
}
