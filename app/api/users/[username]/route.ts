import { NextResponse } from "next/server";
import { findUserByUsername, type WalletUserProfile } from "@/src/data/userRepository";

const sanitize = (user: WalletUserProfile | null) => {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  void _password;
  return rest;
};

export async function GET(_req: Request, { params }: { params: { username: string } }) {
  const user = await findUserByUsername(params.username);
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }
  return NextResponse.json({ user: sanitize(user) });
}
