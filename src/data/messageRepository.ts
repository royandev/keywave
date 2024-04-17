import { appendBlock, inboxForWallet } from "./ledgerRepository";

export type MessageBlockPayload = {
  senderWallet: string;
  receiverWallet: string;
  subject: string;
  body: string;
  signature: string;
};

export const saveMessageBlock = async (payload: MessageBlockPayload) =>
  appendBlock({ type: "message", ...payload }, payload.senderWallet);

export const listInboxBlocks = async (wallet: string) => inboxForWallet(wallet);
