import { appendBlock, latestApprovalForWallet } from "./ledgerRepository";

export type ApprovalBlockPayload = {
  ownerWallet: string;
  approvedWallets: string[];
  signature: string;
};

export const saveApprovalBlock = async (payload: ApprovalBlockPayload) =>
  appendBlock({ type: "approval", ...payload }, payload.ownerWallet);

export const fetchLatestApproval = async (wallet: string) => latestApprovalForWallet(wallet);
