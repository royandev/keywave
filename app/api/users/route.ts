import { NextResponse } from "next/server";
import { generateKeyPair } from "@/src/crypto/rsa";
import { findUserByUsername, findUserByWallet, listUsers, saveUser, type WalletUserProfile } from "@/src/data/userRepository";

const sanitize = (user: WalletUserProfile | null) => {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  void _password;
  return rest;
};

export async function GET() {
  const users = await listUsers();
  return NextResponse.json({ users: users.map(sanitize) });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { username, password, walletAddress } = body ?? {};
  if (!username || !password || !walletAddress) {
    return NextResponse.json({ error: "username, password, and walletAddress are required" }, { status: 400 });
  }

  const duplicateUsername = await findUserByUsername(username);
  const duplicateWallet = await findUserByWallet(walletAddress);
  if (duplicateUsername || duplicateWallet) {
    return NextResponse.json({ error: "username or wallet already exists" }, { status: 409 });
  }

  const { publicKey, privateKey } = generateKeyPair();
  const user = await saveUser({ username, password, walletAddress, publicKey, privateKey });
  return NextResponse.json({ user: sanitize(user) }, { status: 201 });
}
