import { NextResponse } from "next/server";
import { decryptWithPrivateKey, verifyPayload } from "@/src/crypto/rsa";
import { listInboxBlocks } from "@/src/data/messageRepository";
import { findUserByWallet } from "@/src/data/userRepository";

export async function GET(_req: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;
  const receiver = await findUserByWallet(wallet);
  if (!receiver) return NextResponse.json({ messages: [] });

  const inbox = await listInboxBlocks(wallet);
  const mapped = await Promise.all(
    inbox.map(async (block) => {
      const decrypted = {
        subject: decryptWithPrivateKey(block.data.subject, receiver.privateKey),
        body: decryptWithPrivateKey(block.data.body, receiver.privateKey),
      };
      const sender = await findUserByWallet(block.data.senderWallet);
      const isValid = sender
        ? verifyPayload(
            {
              senderWallet: block.data.senderWallet,
              receiverWallet: block.data.receiverWallet,
              subject: decrypted.subject,
              messageBody: decrypted.body,
            },
            block.data.signature,
            sender.publicKey
          )
        : false;
      return {
        ...block.data,
        ...decrypted,
        isValid,
        timestamp: block.timestamp,
      };
    })
  );

  return NextResponse.json({ messages: mapped });
}
