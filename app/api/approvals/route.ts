import { NextResponse } from "next/server";
import { fetchLatestApproval, saveApprovalBlock } from "@/src/data/approvalRepository";
import { findUserByUsername } from "@/src/data/userRepository";
import { signPayload } from "@/src/crypto/rsa";

export async function POST(request: Request) {
  const body = await request.json();
  const { ownerUsername, approvedWallets } = body ?? {};
  if (!ownerUsername || !Array.isArray(approvedWallets)) {
    return NextResponse.json({ error: "ownerUsername and approvedWallets are required" }, { status: 400 });
  }

  const owner = await findUserByUsername(ownerUsername);
  if (!owner) {
    return NextResponse.json({ error: "owner not found" }, { status: 404 });
  }

  const payload = {
    ownerWallet: owner.walletAddress,
    approvedWallets,
  };
  const signature = signPayload(payload, owner.privateKey);
  const block = await saveApprovalBlock({ ...payload, signature });

  return NextResponse.json({ approval: { ...payload, signature, blockTimestamp: block.timestamp } }, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wallet = searchParams.get("wallet");
  if (!wallet) {
    return NextResponse.json({ error: "wallet is required" }, { status: 400 });
  }
  const block = await fetchLatestApproval(wallet);
  if (!block) return NextResponse.json({ approval: null });
  return NextResponse.json({ approval: block.data, timestamp: block.timestamp });
}
