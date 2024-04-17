import { JsonFileStore } from "../lib/fileStore";
import { LedgerBlock, TokenLedger } from "../ledger/tokenLedger";

export type LedgerPayload =
  | { type: "message"; senderWallet: string; receiverWallet: string; subject: string; body: string; signature: string }
  | { type: "approval"; ownerWallet: string; approvedWallets: string[]; signature: string };

const store = new JsonFileStore<LedgerBlock<LedgerPayload>[]>("data/ledger.json");

const loadLedger = async () => {
  const chain = await store.read([]);
  const ledger = new TokenLedger<LedgerPayload>(chain);
  if (!ledger.validate()) {
    console.warn("ledger validation failed; continuing with recovered chain");
  }
  return ledger;
};

export const appendBlock = async (payload: LedgerPayload, walletOwner: string) => {
  const ledger = await loadLedger();
  const block = ledger.append(payload, walletOwner);
  await store.write(ledger.snapshot());
  return block;
};

export const fetchBlocks = async () => {
  const ledger = await loadLedger();
  return ledger.snapshot();
};

export const latestApprovalForWallet = async (wallet: string) => {
  const chain = await fetchBlocks();
  const approvals = chain.filter((block) => block.data.type === "approval" && block.data.ownerWallet === wallet);
  if (approvals.length === 0) return null;
  return approvals.sort((a, b) => b.timestamp - a.timestamp)[0];
};

export const inboxForWallet = async (wallet: string) => {
  const chain = await fetchBlocks();
  return chain.filter((block) => block.data.type === "message" && block.data.receiverWallet === wallet);
};
