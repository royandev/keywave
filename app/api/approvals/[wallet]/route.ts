import { NextResponse } from "next/server";
import { fetchLatestApproval } from "@/src/data/approvalRepository";
import { verifyPayload } from "@/src/crypto/rsa";
import { findUserByWallet } from "@/src/data/userRepository";

export async function GET(_req: Request, { params }: { params: { wallet: string } }) {
  const wallet = params.wallet;
  const block = await fetchLatestApproval(wallet);
  if (!block) return NextResponse.json({ approval: null });

  const owner = await findUserByWallet(wallet);
  if (!owner) {
    return NextResponse.json({ approval: null, error: "owner not found" }, { status: 404 });
  }

  const isValid = verifyPayload(
    { ownerWallet: wallet, approvedWallets: block.data.approvedWallets },
    block.data.signature,
    owner.publicKey
  );

  return NextResponse.json({ approval: { ...block.data, isValid }, timestamp: block.timestamp });
}
