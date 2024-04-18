import { NextResponse } from "next/server";
import { findUserByUsername, findUserByWallet } from "@/src/data/userRepository";
import { fetchLatestApproval } from "@/src/data/approvalRepository";
import { encryptWithPublicKey, signPayload, verifyPayload } from "@/src/crypto/rsa";
import { saveMessageBlock } from "@/src/data/messageRepository";

export async function POST(request: Request) {
  const body = await request.json();
  const { senderUsername, receiverWallet, subject, messageBody } = body ?? {};
  if (!senderUsername || !receiverWallet || !subject || !messageBody) {
    return NextResponse.json({ error: "senderUsername, receiverWallet, subject, and messageBody are required" }, { status: 400 });
  }

  const sender = await findUserByUsername(senderUsername);
  if (!sender) return NextResponse.json({ error: "sender not found" }, { status: 404 });
  const receiver = await findUserByWallet(receiverWallet);
  if (!receiver) return NextResponse.json({ error: "receiver not found" }, { status: 404 });

  const approvalBlock = await fetchLatestApproval(receiver.walletAddress);
  if (approvalBlock) {
    const approved = verifyPayload(
      { ownerWallet: receiver.walletAddress, approvedWallets: approvalBlock.data.approvedWallets },
      approvalBlock.data.signature,
      receiver.publicKey
    );
    const isSenderAllowed = approved && approvalBlock.data.approvedWallets.includes(sender.walletAddress);
    if (!isSenderAllowed) {
      return NextResponse.json({ error: "sender not approved for this wallet" }, { status: 403 });
    }
  }

  const envelope = {
    senderWallet: sender.walletAddress,
    receiverWallet,
    subject,
    messageBody,
  };

  const signature = signPayload(envelope, sender.privateKey);
  const encryptedSubject = encryptWithPublicKey(subject, receiver.publicKey);
  const encryptedBody = encryptWithPublicKey(messageBody, receiver.publicKey);

  const block = await saveMessageBlock({
    senderWallet: sender.walletAddress,
    receiverWallet,
    subject: encryptedSubject,
    body: encryptedBody,
    signature,
  });

  return NextResponse.json({ message: "message dispatched to token ledger", blockTimestamp: block.timestamp });
}
